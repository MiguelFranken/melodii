import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import { Logger } from '@overnightjs/logger';
import { Event } from './socket-events';

export class SocketServer {
  public static readonly PORT: number = 8080;
  private readonly app: express.Application;
  private readonly server: Server;
  private io: SocketIO.Server;
  private readonly port: string | number;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || SocketServer.PORT;
    this.server = createServer(this.app);
    this.io = socketIo(this.server);
    this.listen();
  }

  public emit(event: Event, data: any) {
    Logger.Info(`Emitting event ${event}`);
    this.io.emit(event, data);
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      Logger.Info(`Running server on port ${this.port}`);
    });

    this.io.on(Event.CONNECT, (socket: any) => {
      Logger.Info(`Connected client on port ${this.port}.`);

      socket.on(Event.PLAYED_NOTE, (_: any) => {
        Logger.Info(`Received played note`);
      });

      socket.on(Event.SLIDER_UPDATE, (_: any) => {
        Logger.Info(`Received slider update`);
      });

      socket.on(Event.DISCONNECT, () => {
        Logger.Info('Client disconnected');
      });
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}
