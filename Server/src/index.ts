import { SocketServer } from './socket/socket-server';
import { Logger, LoggerModes } from '@overnightjs/logger';
import { UdpServer } from './udp-server';
import { Event } from './socket/socket-events';
import { Action } from './socket/socket-actions';
import { IOSCMessage } from './osc/osc-message';
const { RTCPeerConnection, RTCSessionDescription } = require('wrtc');

// -----------------------------------------------------
// ---------------------- WebRTC -----------------------
// -----------------------------------------------------
interface IRTCOffer {
  name: PeerName;
  sdp: RTCSessionDescription;
}

interface IRTCAnswer {
  name: PeerName;
  sdp: RTCSessionDescription;
}

interface IRTCNewICECandidate {
  name: PeerName;
  candidate: RTCIceCandidate | null;
}

type PeerName = string;

/**
 * Socket connection between frontend and osc server.
 * Used as signaling connection to send signaling/negotiation messages
 * necessary to establish a WebRTC connection.
 */
const clientSocket = new SocketServer(8080);

const peerConnections = new Map<PeerName, RTCPeerConnection>();
const sendChannels = new Map<PeerName, RTCDataChannel>();

clientSocket.onAction(Action.NEW_ICE_CANDIDATE, (msg: IRTCNewICECandidate) => {
  if (peerConnections.has(msg.name) && msg.candidate != null) {
    const pc: RTCPeerConnection = peerConnections.get(msg.name) as RTCPeerConnection;
    pc.addIceCandidate(msg.candidate)
      .then(
        () => Logger.Info(`[WebRTC] AddIceCandidate success for peer '${msg.name}'`),
        (err: any) => Logger.Err(`[WebRTC] Failed to add Ice Candidate for peer '${msg.name}': ${err.toString()}`),
      );
  }
});

clientSocket.onAction(Action.RTC_OFFER, (offer: IRTCOffer) => {
  const peerName: PeerName = offer.name;
  Logger.Info(`[WebRTC] Received RTC Offer from peer '${peerName}'`);

  // create a RTCPeerConnection
  const pc = new RTCPeerConnection();
  peerConnections.set(peerName, pc);

  // create a data channel
  const sendChannel = pc.createDataChannel('dataChannelServer', {
    ordered: false,
    maxRetransmits: 0,
  });
  sendChannels.set(peerName, sendChannel);

  // handle RTCPeerConnectionIceEvent
  pc.onicecandidate = (e: RTCPeerConnectionIceEvent) => {
    const candidate: IRTCNewICECandidate = {
      name: peerName,
      candidate: e.candidate,
    };
    clientSocket.emit(Event.NEW_ICE_CANDIDATE, candidate);
  };

  // create RTCSessionDescription using the received SDP offer from frontend
  const desc = new RTCSessionDescription(offer.sdp);

  // Tell WebRTC about Frontend's configuration
  pc.setRemoteDescription(desc).then(() => {
    // create a SDP answer to send to frontend
    return pc.createAnswer();
  }).then((answer: any) => {
    // Configure OSCServer's end of the connection
    return pc.setLocalDescription(answer);
  }).then(() => {
    const answer: IRTCAnswer = {
      name: peerName,
      sdp: pc.localDescription,
    };
    clientSocket.emit(Event.RTC_ANSWER, answer);
  }).catch(() => Logger.Err("[WebRTC] setRemoteDescription error"));

  // handle events for data channel
  const onSendChannelStateChange = () => {
    const readyState = sendChannel.readyState;
    Logger.Info(`[WebRTC] Send channel state from peer '${peerName}' is: ${readyState}`);
  };
  sendChannel.onopen = onSendChannelStateChange;
  sendChannel.onclose = onSendChannelStateChange;

  // close peer connection when user closed his browser
  pc.onconnectionstatechange = () => {
    switch (pc.connectionState) {
      case "connected":
        Logger.Info(`[WebRTC] The connection with peer '${peerName}' has become fully connected`);
        break;
      case "disconnected":
      case "failed":
        Logger.Err(`[WebRTC] One or more transports with peer '${peerName}' has terminated unexpectedly or in an error. Closing connection...`);
        sendChannel.close();
        pc.close();
        peerConnections.delete(peerName);
        sendChannels.delete(peerName);
        break;
      case "closed":
        Logger.Info(`[WebRTC] The connection with peer '${peerName}' has been closed`);
        break;
    }
  };

  // connect to receive channel that frontend has created on their side
  pc.ondatachannel = (event: any) => {
    const receiveChannel = event.channel; // access to channel created by frontend

    // handle received messages
    receiveChannel.onmessage = (event: MessageEvent) => {
      Logger.Info(`[WebRTC] Received Message from peer '${peerName}': '${event.data}'`);
      broadcastRTCMessage(event.data);
    };

    // log channel state changes for debugging
    const receiveChannelStateChange = () => {
      const readyState = receiveChannel.readyState;
      Logger.Info(`[WebRTC] Receive channel state from peer '${peerName}' is: ${readyState}`);
    };
    receiveChannel.onopen = receiveChannelStateChange;
    receiveChannel.onclose = receiveChannelStateChange;
  };
});

// sends the specified message to all connected frontend peers
function broadcastRTCMessage(message: string) {
  Logger.Info(`[WebRTC] Broadcasting message... ${message}`);
  sendChannels.forEach((dataChannel: RTCDataChannel, peerName: PeerName) => {
    if (dataChannel.readyState === 'open') {
      dataChannel.send(message);
      Logger.Info(`[WebRTC] Sent message to peer '${peerName}': ${message}`);
    } else {
      Logger.Err(`Cannot send message to peer '${peerName}'`);
    }
  });
}

// -----------------------------------------------------
// ------------------------ UDP ------------------------
// -----------------------------------------------------
const udpServer = new UdpServer(57121);

// redirects osc messages from the instruments to all the connected frontend peers
udpServer.onMessage((message: IOSCMessage) => {
  broadcastRTCMessage(JSON.stringify(message));
});
