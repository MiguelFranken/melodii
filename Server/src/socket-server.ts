import * as socketIo from 'socket.io';
import { Logger } from '@overnightjs/logger';

class SocketEvents {
  public static connect = "connect";
  public static message = "message";
}

export class SocketServer {
  private readonly io: socketIo.Server;

  constructor(
    public readonly port: Port,
  ) {
    this.io = socketIo(this.port);
    this.io.on(SocketEvents.connect, (socket: SocketIO.Socket) => {
      Logger.Info(`New connection from ${socket.conn.remoteAddress}.`)
    })
  }

  public onConnection(callback: (socket: SocketIO.Socket) => void) {
    this.io.on(SocketEvents.connect, callback);
  }

  public onMessage(callback: (message: any) => void) {
    this.io.on(SocketEvents.message, callback);
  }

  public emit(data?: any) {
    Logger.Info(`Emitting message on port ${this.port}.\nData is: ${JSON.stringify(data)}`);
    this.io.emit(SocketEvents.message, data);
  }
}
