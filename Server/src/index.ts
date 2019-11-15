import * as ip from 'ip';
import { SocketServer } from './socket-server';
import { Logger } from '@overnightjs/logger';
import { UdpServer } from './udp-server';

const clientSocket = new SocketServer(8080);
Logger.Info(`Client socket server listening on port ${clientSocket.port}.`);
const tonegeneratorSocket = new SocketServer(8000);
Logger.Info(`Tone generator socket server listening on port ${clientSocket.port}.`);

clientSocket.onMessage(message => {
    tonegeneratorSocket.emit(message);
});

const udpServer = new UdpServer(57121);
const myIp = ip.address();
Logger.Info(`UDP server listening for OSC messages at ${myIp}:${udpServer.port}`);

udpServer.onMessage(message => {
    tonegeneratorSocket.emit(message);
});