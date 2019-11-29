import * as io from 'socket.io-client';
import { Event } from './socket-event';
import { ControllerHandler } from './decorator';
import { Logger } from '@upe/logger';

export class SocketServer {

  private controllerHandler: ControllerHandler;

  private logger: Logger = new Logger({ name: 'SocketServer', flags: ['service'] });

  private readonly socket: SocketIOClient.Socket;

  constructor(path: string) {
    this.socket = io(path);
    this.socket.on(Event.CONNECT, () => {
      this.logger.info(`Established websocket connection to OSC-Server (${path})`);
    });
    this.socket.on(Event.DISCONNECT, () => {
      this.logger.info(`Disconnected websocket connection to OSC-Server (${path})`);
    });

    this.controllerHandler = new ControllerHandler();
  }

  // adds controllers that receive the routed osc messages
  public addControllers(controllers: Function[] | string[]) {
    this.controllerHandler.addControllers(this.socket, controllers);
  }

}
