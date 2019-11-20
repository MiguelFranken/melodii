import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import { Logger } from '@overnightjs/logger';
import { Event } from './socket-events';
import { Action } from "./socket-actions";
import { IOSCMessage } from "../osc/osc-message";

export type Port = number;

/**
 * Socket server for bi-directional communication with the Angular frontend.
 */
export class SocketServer {
  private readonly app: express.Application;
  private readonly server: Server;
  private io: socketIo.Server;

  constructor(public readonly port: Port) {
    this.app = express();
    this.server = createServer(this.app);
    this.io = socketIo(this.server);
    this.listen();
  }

  /**
   * Emits some event
   * @param event Predefined event
   * @param data Optional data that is being sent with the event
   */
  public emit(event: Event, data?: any) {
    if (data) {
      Logger.Info(`[Socket:${this.port}] Emitting event '${event}' with data ${JSON.stringify(data)}`);
      this.io.emit(event, data);
    } else {
      Logger.Info(`[Socket:${this.port}] Emitting event '${event}' without data`);
      this.io.emit(event);
    }
  }

  /**
   * Opens the socket
   */
  private listen(): void {
    this.server.listen(this.port, () => {
      Logger.Info(`[Socket:${this.port}] Started websocket`);
    });
    this.io.on(Event.CONNECT, (socket: socketIo.Socket) => {
      Logger.Info(`[Socket:${this.port}] Connected client ${socket.conn.remoteAddress}.`);
    });
  }

  /**
   * Listen for actions from frontend
   * @param action An action sent from the frontend
   * @param callback Callback lister method executed when socket receives a message with the specified action
   */
  public onAction(action: Action, callback: (msg: IOSCMessage) => void) {
    this.io.on(Event.CONNECT, (socket: socketIo.Socket) => {
      const fn = (msg: IOSCMessage) => {
        Logger.Info(`[Socket:${this.port}] Received action '${action}' from frontend with message '${JSON.stringify(msg)}'`);
        callback(msg);
      };
      socket.on(action, fn);
    });
  }

}
