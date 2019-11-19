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
      Logger.Info(`New connection from ${socket.conn.remoteAddress}.`)
    })
  }

  public onConnection(callback: (socket: socketIo.Socket) => void) {
    this.io.on(SocketEvents.CONNECT, callback);
  }

  public onMessage(callback: (message: any) => void) {
    this.io.on(SocketEvents.MESSAGE, callback);
  }

  public emit(data?: any) {
    Logger.Info(`Emitting message on port ${this.port}: ${JSON.stringify(data)}`);
    this.io.emit(SocketEvents.MESSAGE, data);
  }
}
