import * as express from 'express';
import * as path from 'path';
import * as ip from 'ip';
import { SocketServer } from './socket-server';
import { Logger } from '@overnightjs/logger';
import { UdpServer } from './udp-server';

/**
 * TODO
 */
const clientSocket = new SocketServer(8080);
Logger.Info(`Client socket server listening on port ${clientSocket.port}.`);

/**
 * TODO
 */
const tonegeneratorSocket = new SocketServer(8000);
Logger.Info(`Tone generator socket server listening on port ${clientSocket.port}.`);

// redirect messages from frontend to tone generator
clientSocket.onMessage(message => {
    tonegeneratorSocket.emit(message);
});

// TODO: Es soll auch möglich sein OSC Nachrichten zurück an die Instrumente zu senden
const udpServer = new UdpServer(57121);
const myIp = ip.address();
Logger.Info(`UDP server listening for OSC messages at ${myIp}:${udpServer.port}`);

// redirects osc messages from the instruments to the frontend and the tone generator
udpServer.onMessage(message => {
    tonegeneratorSocket.emit(message);
    clientSocket.emit(message);
});

// TODO: Eigene Komponente hierfür
/*const webserver = express();
webserver.use('/', express.static(path.join(__dirname, 'public')));
const webserverPort = 80;
webserver.listen(webserverPort, () => console.log(`Example app listening on port ${webserverPort}!`));*/
