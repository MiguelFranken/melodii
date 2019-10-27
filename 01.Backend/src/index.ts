import { OSCServer } from './osc/osc-server';
import { SocketServer } from './socket/socket-server';
import "reflect-metadata";
import { Container } from './osc/decorators';
import { CONTROLLERS } from './osc/controllers';
import { Music } from "./music/music";

//region Socket-Server for bi-directional communication with frontend
/**
 * Initializes and starts the websocket server
 */
const webserver: SocketServer = new SocketServer();
//endregion

//region OSC-Server for communication with music instruments
export const container = new Container();
const music = new Music();
container.addSingletonDependency(SocketServer, webserver);
container.addSingletonDependency(Music, music);

//region Starting OSC Server
const ocsServer = new OSCServer("0.0.0.0", 57121, "192.168.0.59", 4559);
ocsServer.handleMusicEvents(music.getMusicObservable());
ocsServer.addControllers(CONTROLLERS, webserver);
ocsServer.connect();
//endregion
//endregion
