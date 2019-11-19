import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import { Logger } from '@overnightjs/logger';
import { Event } from './socket-events';
import { Action } from "./socket-actions";
import { IOSCMessage } from "../osc/osc-message";

/**
 * Socket server for bi-directional communication with the Angular frontend.
 */
export class SocketServer {
  public static readonly PORT: number = 8080;
  private readonly app: express.Application;
  private readonly server: Server;
  private io: socketIo.Server;
  private readonly port: string | number;

  constructor() {
    this.app = express();
    this.port = SocketServer.PORT;
    this.server = createServer(this.app);
    this.io = socketIo(this.server);
    this.listen();
  }

  /**
   * Emits some event to the frontend.
   * @param event Predefined event that the Frontend & Backend both know
   * @param data Optional data that is being sent with the event
   */
  public emit(event: Event, data?: any) {
    Logger.Info(`Emitting event ${event} to Angular`);
    if (data) {
      this.io.emit(event, data);
    } else {
      this.io.emit(event);
    }
  }

  /**
   * Listen for events sent by the frontend.
   *
   * TODO MF: - Maybe we should distinguish between output events (events sent to frontend)
   *            and input events (events received from frontend).
   *          - If our system will heavily rely on communication from frontend to backend,
   *            then we should also create decorators for some socket server controllers
   *            similar to the osc controllers already existing.
   */
  private listen(): void {
    this.server.listen(this.port, () => {
      Logger.Info(`Running server on port ${this.port}`);
    });

    this.io.on(Event.CONNECT, (socket: any) => {
      Logger.Info(`Connected client on port ${this.port}.`);

      // Listen for actions from frontend
      socket.on(Action.SEND_OSC_MESSAGE, (msg: IOSCMessage) => {
        Logger.Info(`Received OSC message from Frontend`);
        this.emit(Event.OSC_MESSAGE, msg);
      });
    });
  }
}
