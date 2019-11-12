import * as ip from "ip";
import { OSCServer } from './osc-server';
import { SocketServer } from './socket/socket-server';
import { Logger } from '@overnightjs/logger';

//region Socket-Server for bi-directional communication with frontend
/**
 * Initializes and starts the websocket server
 */
const websocket: SocketServer = new SocketServer();
//endregion

//region OSC-Server for communication with music instruments
// export const container = new Container();
// container.addSingletonDependency(SocketServer, webserver);

//region Starting OSC Server
const oscPort = 57121;
const ocsServer = new OSCServer("0.0.0.0", oscPort);
// ocsServer.addControllers(CONTROLLERS, webserver);
ocsServer.connect();
ocsServer.redirect(websocket);
const myIp = ip.address();
Logger.Info(`You can send OSC messages to the OSC server on ${myIp}:${oscPort}.`);
//endregion
//endregion
