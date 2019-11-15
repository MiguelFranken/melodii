import { SocketServer } from './socket-server';
import { Logger } from '@overnightjs/logger';

const clientSocket = new SocketServer(8080);
Logger.Info(`Client socket server listening on port ${clientSocket.port}.`)
const tonegeneratorSocket = new SocketServer(8000);
Logger.Info(`Tone generator socket server listening on port ${clientSocket.port}.`)

clientSocket.onMessage(message => {
    tonegeneratorSocket.emit(message);
})

/*
// Starting OSC Server
const oscPort = 57121;
const ocsServer = new OSCServer("0.0.0.0", oscPort);
ocsServer.connect();
ocsServer.redirect(websocket);
const myIp = ip.address();
Logger.Info(`You can send OSC messages to the OSC server on ${myIp}:${oscPort}.`);
*/