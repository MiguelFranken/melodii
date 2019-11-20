import * as socketIo from 'socket.io';
import { Logger } from '@overnightjs/logger';

enum SocketEvents {
  CONNECT = "connect",
  MESSAGE = "message"
}

export class SocketServer {
  private readonly io: socketIo.Server;

  constructor(
    public readonly port: Port,
  ) {
    this.io = socketIo(this.port);
    this.io.on(SocketEvents.CONNECT, (socket: socketIo.Socket) => {
      Logger.Info(`[Socket on port ${this.port}] New connection from ${socket.conn.remoteAddress}.`)
    })
  }

  public onMessage(callback: (message: any) => void) {
    const fn = (message: any) => {
      Logger.Info(`[Socket on port ${this.port}] Received message: ${message}`);
      callback(message);
    };
    this.io.on(SocketEvents.MESSAGE, fn);
  }

  public emit(data?: any) {
    Logger.Info(`[Socket on port ${this.port}] Emitting message: ${JSON.stringify(data)}`);
    this.io.emit(SocketEvents.MESSAGE, data);
  }
}
