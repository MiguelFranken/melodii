import { IOSCArgs, OSCMessage } from './osc/osc-message';
import { OSCInputMessage } from './osc/osc-input-message';
import { OSCServer } from './osc/osc-server';
import { get, isPresent, Optional } from './util';
import { Logger } from '@overnightjs/logger';
import { SocketServer } from './socket/socket-server';
import { Event } from './socket/socket-events';
import "reflect-metadata";
import { addControllers } from './decorators';
import { CONTROLLERS } from './controllers';

//region Socket-Server for bi-directional communication with frontend
/**
 * Initializes and starts the websocket server
 */
const webserver: SocketServer = new SocketServer();
const app = webserver.getApp();
//endregion

//region OSC-Server for communication with music instruments
//region Event Handlers
// logs what the sender sent
const messageLogger = (oscMsg: OSCInputMessage) => {
  // do something different for each control (e.g. switch, button, slider, ...)
  switch (oscMsg.getType()) {
    case "switch":
      const optOscArg: Optional<IOSCArgs> = oscMsg.getFirstArg();
      if (isPresent(optOscArg)) {
        const oscArg: IOSCArgs = get<IOSCArgs>(optOscArg);
        Logger.Info(`Control of type '${oscMsg.getTypeString()}' updated: ${oscArg.value}`);
      } else {
        Logger.Err('Argument is not available');
      }
      break;

    case "unknown":
      Logger.Info('Received osc message for unknown control! ');
      break;
  }
};

// logs who the sender is
const remoteInfoLogger = (oscMsg: OSCInputMessage) => {
  Logger.Info(`Remote address is: '${oscMsg.getInfo().address}'`);
};

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
ocsServer.addMessageListener(messageLogger);
ocsServer.addMessageListener(remoteInfoLogger);
ocsServer.addMessageListener(playSoundForEachMessage);
ocsServer.connect();
//endregion

addControllers(ocsServer.getIO(), CONTROLLERS, webserver);
//endregion
