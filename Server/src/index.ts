import * as ip from 'ip';
import { SocketServer } from './socket/socket-server';
import { Logger } from '@overnightjs/logger';
import { UdpServer } from './udp-server';
import { Event } from "./socket/socket-events";
import { Action } from "./socket/socket-actions";
import { IOSCMessage } from './osc/osc-message';

const clientSocket = new SocketServer(8080);
const tonegeneratorSocket = new SocketServer(8000);

clientSocket.onAction(Action.REDIRECT_OSC_MESSAGE, (msg) => {
  Logger.Info(`[Client Socket] Redirecting message from frontend to tone generator...`);
  tonegeneratorSocket.emit(Event.OSC_MESSAGE, msg);
});

// TODO: Es soll auch möglich sein OSC Nachrichten zurück an die Instrumente zu senden
const udpServer = new UdpServer(57121);

// redirects osc messages from the instruments to the frontend and the tone generator
udpServer.onMessage((message: IOSCMessage) => {
  tonegeneratorSocket.emit(Event.OSC_MESSAGE, message);
  clientSocket.emit(Event.OSC_MESSAGE, message);
});
