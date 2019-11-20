import * as io from "socket.io-client";
import { Event } from "./socket-event";
import { addControllers } from "./decorator";

export class SocketServer {

  private readonly socket: SocketIOClient.Socket;

  constructor(path: string) {
    this.socket = io(path);
    this.socket.on(Event.CONNECT, () => {
      console.log(`Established websocket connection to OSC-Server (${path})`);
    });
    this.socket.on(Event.DISCONNECT, () => {
      console.log(`Disconnected websocket connection to OSC-Server (${path})`);
    });
  }

  // adds controllers that receive the routed osc messages
  public addControllers(controllers: Function[] | string[]) {
    addControllers(this.socket, controllers);
  }

}
