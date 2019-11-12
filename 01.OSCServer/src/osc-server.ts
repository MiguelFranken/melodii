import { Logger } from '@overnightjs/logger';
import * as OSC from 'osc';
import { SocketServer } from "./socket/socket-server";
import { Event } from "./socket/socket-events";
import { IOSCRawMessage } from "./osc/osc-types";
import { IOSCMessage } from "./osc/osc-message";

export class OSCServer {
  private readonly udp: OSC.UDPPort; // socket communication between us and music instruments

  constructor(ip: string, port: number) {
    // prepares udp socket for message input from music instruments
    this.udp = new OSC.UDPPort({
      localAddress: ip,
      localPort: port,
    });
    Logger.Info(`Starting OSC server on ip '${ip}' and port '${port}'..`);
  }

  // connects to the udp socket
  public connect() {
    this.udp.open();
    Logger.Info('Started OSC server successfully!');
  }

  public redirect(websocket: SocketServer) {
    const handler = (oscRawMsg: IOSCRawMessage, timeTag: any, info: any) => {
      const msg: IOSCMessage = {
        address: oscRawMsg.address,
        args: oscRawMsg.args,
        info: info,
      };
      websocket.emit(Event.OSC_MESSAGE, msg);
    };
    this.udp.on("message", handler);
  }

}
