import { OSCMessage } from "./osc-message";
import { Logger } from '@overnightjs/logger';
import * as OSC from 'osc';
import { IOSCRawMessage } from "./osc-types";
import { SocketServer } from "../socket/socket-server";
import { addControllers } from "./decorators";
import { Observable } from "rxjs";

export class OSCServer {
  private readonly udp: OSC.UDPPort; // socket communication between us and music instruments
  private readonly outputIp: string; // sonic pi ip
  private readonly outputPort: number; // sonic pi port

  constructor(ip: string, port: number, outputIp: string, outputPort: number) {
    // prepares udp socket for message input from music instruments
    this.udp = new OSC.UDPPort({
      localAddress: ip,
      localPort: port,
      remotePort: outputPort,
      remoteAddress: outputIp,
      metadata: true,
    });
    Logger.Info(`Starting OSC server on ip '${ip}' and port '${port}'..`);

    // save address to sonic pi
    this.outputIp = outputIp;
    this.outputPort = outputPort;
  }

  // connects to the udp socket
  public connect() {
    this.udp.open();
    Logger.Info('Started server successfully!');
  }

  /**
   * Handles musical events sent by the music class
   * @param observable Receives OSCMessages that should get redirected to sonic pi
   */
  public handleMusicEvents(observable: Observable<OSCMessage>) {
    observable.subscribe((msg: OSCMessage) => {
      // ignore initial empty osc message
      if (msg.getAddress() == "") {
        return;
      }

      // redirect every message to sonic pi
      this.sendMessageToSonicPi(msg);
    });
  }

  // adds controllers that receive the routed osc messages
  public addControllers(controllers: Function[] | string[], socketServer: SocketServer) {
    addControllers(this.udp, controllers, socketServer);
  }

  // allows you to send osc messages to sonic pi
  public sendMessageToSonicPi(msg: OSCMessage) {
    const rawMsg: IOSCRawMessage = {
      address: msg.getAddress(),
      args: msg.getArgs(),
    };

    this.udp.send(rawMsg, this.outputIp, this.outputPort);
  }

}
