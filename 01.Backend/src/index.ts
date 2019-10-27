import { OSCMessage } from './osc/osc-message';
import { OSCServer } from './osc/osc-server';
import { Logger } from '@overnightjs/logger';
import { SocketServer } from './socket/socket-server';
import "reflect-metadata";
import { Container } from './decorators';
import { CONTROLLERS } from './controllers';
import { IOSCArgs } from "./osc/osc-types";

//region Socket-Server for bi-directional communication with frontend
/**
 * Initializes and starts the websocket server
 */
const webserver: SocketServer = new SocketServer();
//endregion

//region OSC-Server for communication with music instruments
export const container = new Container();
container.addSingletonDependency(SocketServer, webserver);

// plays a sound for each received message
const playSoundForEachMessage = () => {
  Logger.Info("Play sound");
  const note: IOSCArgs = {
    type: "i",
    value: 50,
  };
  const msg = new OSCMessage("/play/piano", [ note ]);
  ocsServer.sendMessage(msg);
};

//region Starting OSC Server
const ocsServer = new OSCServer("0.0.0.0", 57121, "192.168.0.241", 4559);
ocsServer.addControllers(CONTROLLERS, webserver);
ocsServer.addMessageListener(playSoundForEachMessage); // TODO MF: delete this
ocsServer.connect();
//endregion
//endregion
