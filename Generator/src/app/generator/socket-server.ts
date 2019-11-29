import * as io from 'socket.io-client';
import { Event } from './socket-event';
import { addControllers } from './decorator';
import { Logger } from '@upe/logger';

export class SocketServer {

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
  }

  // adds controllers that receive the routed osc messages
  public addControllers(controllers: Function[] | string[]) {
    addControllers(this.socket, controllers);
  }

}
