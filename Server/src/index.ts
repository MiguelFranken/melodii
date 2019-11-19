import * as express from 'express';
import * as path from 'path';
import * as ip from 'ip';
import { SocketServer } from './socket-server';
import { Logger } from '@overnightjs/logger';
import { UdpServer } from './udp-server';

const clientSocket = new SocketServer(8080);
Logger.Info(`Client socket server listening on port ${clientSocket.port}.`);
const tonegeneratorSocket = new SocketServer(8000);
Logger.Info(`Tone generator socket server listening on port ${clientSocket.port}.`);

// TODO: OSC Nachrichten müssen auch an das Frontend geleitet werden
clientSocket.onMessage(message => {
    tonegeneratorSocket.emit(message);
});

// TODO: Es soll auch möglich sein OSC Nachrichten zurück an die Instrumente zu senden
const udpServer = new UdpServer(57121);
const myIp = ip.address();
Logger.Info(`UDP server listening for OSC messages at ${myIp}:${udpServer.port}`);

udpServer.onMessage(message => {
    tonegeneratorSocket.emit(message);
});

// TODO: Eigene Komponente hierfür
const webserver = express();
webserver.use('/', express.static(path.join(__dirname, 'public')));
const webserverPort = 80;
webserver.listen(webserverPort, () => console.log(`Example app listening on port ${webserverPort}!`));
