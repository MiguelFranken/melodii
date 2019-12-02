import * as io from 'socket.io-client';
import { Event } from './socket-event';
import { ControllerHandler } from '../decorator';
import { Logger } from '@upe/logger';
import { LogService } from '../../log/log.service';
import { Injectable } from '@angular/core';
import { GeneratorCommunicationService } from '../generator-communication.service';

@Injectable({
  providedIn: 'root'
})
export class SocketServer {

  private controllerHandler: ControllerHandler;
  private controllers: any;

  private logger: Logger = new Logger({ name: 'Generator Socket', flags: ['service'] });

  private socket: SocketIOClient.Socket;
  private path: string;

  constructor(private log: LogService, private directCommunicationService: GeneratorCommunicationService) {
    this.controllerHandler = new ControllerHandler(directCommunicationService);
  }

  public connect(path: string) {
    this.path = path;
    this.socket = io(path);
    this.socket.on(Event.CONNECT, () => {
      this.logger.info(`Established websocket connection to OSC-Server (${path})`);
    });
    this.socket.on(Event.DISCONNECT, () => {
      this.logger.info(`Disconnected websocket connection to OSC-Server (${path})`);
    });
    this.socket.on(Event.OSC_MESSAGE, (msg) => {
      this.log.addMessage(JSON.stringify(msg));
    });
  }

  public disconnect() {
    this.socket.disconnect();
  }

  // adds controllers that receive the routed osc messages
  public addControllers(controllers: Function[] | string[]) {
    this.controllers = controllers;
    this.controllerHandler.addControllers(this.socket, controllers);
  }

  public reconnect() {
    this.logger.info(`Reconnecting to OSC-Server (${this.path})`);
    this.connect(this.path);
    this.controllerHandler.addControllers(this.socket, this.controllers);
  }

}
