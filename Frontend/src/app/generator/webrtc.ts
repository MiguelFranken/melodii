import { Injectable } from '@angular/core';
import { Logger } from '@upe/logger';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocketService } from "../shared/socket/socket.service";
import { Action } from "../shared/socket/action";
import { Event } from "../shared/socket/event";
import { IRTCAnswer, IRTCNewICECandidate, IRTCOffer, PeerName } from "./webrtc.interfaces";
import { filter } from "rxjs/operators";

export let rtcSubject = new BehaviorSubject<string>(''); // for receiving
let peerConnection: RTCPeerConnection;
let receiveChannel: RTCDataChannel;
let socketService: SocketService;
const logger: Logger = new Logger({ name: 'WebRTC' });
let sendChannel: RTCDataChannel; // for sending
let peerName: PeerName;

@Injectable({
  providedIn: 'root'
})
export class WebRTC {

  constructor(private _socketService: SocketService) {
  }

  public init() {
    peerName = new Date().toISOString(); // TODO: Replace name of peer
    socketService = this._socketService;

    socketService.onEvent(Event.RTC_ANSWER).subscribe((answer: IRTCAnswer) => {
      if (answer.name === peerName) {
        logger.info("Received RTC Answer", answer.sdp);

        peerConnection.setRemoteDescription(answer.sdp).then(() => {
          logger.info("Set successfully remote description");
        }).catch((error: any) => {
          logger.error('Could not set remote description', error);
        });
      }
    });

    socketService.onEvent(Event.NEW_ICE_CANDIDATE).subscribe((candidateMsg: IRTCNewICECandidate) => {
      if (candidateMsg.name === peerName) {
        logger.info('Received new candidate', candidateMsg.candidate);

        peerConnection
          .addIceCandidate(candidateMsg.candidate)
          .then(
            () => logger.info(`AddIceCandidate success for peer '${peerName}'`),
            err => logger.error(`Failed to add Ice Candidate for peer '${peerName}': ${err.toString()}`)
          );
      }
    });
  }

  public async connect() {
    const servers = null;
    // create a RTCPeerConnection
    peerConnection = new RTCPeerConnection(servers);

    // create a data channel
    sendChannel = peerConnection.createDataChannel('dataChannelFrontend', {
      ordered: false,
      maxRetransmits: 0,
    });

    peerConnection.onconnectionstatechange = (event) => {
      switch (peerConnection.connectionState) {
        case "connected":
          logger.info("The connection has become fully connected");
          break;
        case "disconnected":
        case "failed":
          logger.error("One or more transports has terminated unexpectedly or in an error");
          break;
        case "closed":
          logger.info("The connection has been closed");
          break;
      }
    };

    // handle RTCPeerConnectionIceEvent
    peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      const candidateMsg: IRTCNewICECandidate = {
        name: peerName,
        candidate: event.candidate
      };
      socketService.send(Action.NEW_ICE_CANDIDATE, candidateMsg);
    };

    // handle negotiation needed event
    peerConnection.onnegotiationneeded = this.sendOffer;

    // handle events for data channel
    const onSendChannelStateChange = () => {
      const readyState = sendChannel.readyState;
      logger.info(`Send channel state from peer '${peerName}' is: ${readyState}`);
    };
    sendChannel.onopen = onSendChannelStateChange;
    sendChannel.onclose = onSendChannelStateChange;

    // receive channel
    peerConnection.ondatachannel = this.receiveChannelCallback;
  }

  public disconnect() {
    if (sendChannel) {
      sendChannel.close();
    }
    if (receiveChannel) {
      receiveChannel.close();
    }
    logger.info('Closed data channels');
    if (peerConnection) {
      peerConnection.close();
    }
    peerConnection = null;
    logger.info('Closed peer connection to OSC server');
  }

  public send(message: Object) {
    const data = JSON.stringify(message);
    sendChannel.send(data);
    logger.info('Sent Data', data);
  }

  public getMessages(): Observable<string> {
    return rtcSubject.asObservable().pipe(filter(receivedMessage => receivedMessage !== ''));
  }

  private sendOffer() {
    peerConnection.createOffer().then((desc: RTCSessionDescriptionInit) => {
      logger.debug('Created sdp offer', desc.sdp);

      // Set description of frontend's end of call
      return peerConnection.setLocalDescription(desc);
    }).then(() => {
      const offer: IRTCOffer = {
        name: peerName,
        sdp: peerConnection.localDescription
      };
      socketService.send(Action.RTC_OFFER, offer);
    }).catch((error: any) => {
      logger.error("Cannot send offer", error);
    });
  }

  private receiveChannelCallback(event) {
    logger.info('Receive Channel Callback', event);
    receiveChannel = event.channel;

    receiveChannel.onmessage = (event) => {
      logger.info("Received Message", event.data);
      rtcSubject.next(event.data);
    };

    receiveChannel.onopen = () => {
      const readyState = receiveChannel.readyState;
      logger.info(`Receive channel state is: ${readyState}`);
    };

    receiveChannel.onclose = () => {
      const readyState = receiveChannel.readyState;
      logger.info(`Receive channel state is: ${readyState}`);
    };
  }

}
