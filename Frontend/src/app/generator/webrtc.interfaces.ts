export type PeerName = string;

export interface IRTCOffer {
  name: PeerName;
  sdp: RTCSessionDescription;
}

export interface IRTCAnswer {
  name: PeerName;
  sdp: RTCSessionDescription;
}

export interface IRTCNewICECandidate {
  name: PeerName;
  candidate: RTCIceCandidate | null; // null means all ice candidates have been sent
}
