import * as OSC from 'osc';
import { IOSCRawMessage } from "./osc/osc-types";
import { IOSCMessage } from "./osc/osc-message";

enum UdpEvent {
  MESSAGE = "message"
}

export class UdpServer {
  private readonly udp: OSC.UDPPort; // for communication between us and music instruments

  constructor(public readonly port: Port) {
    // prepares udp socket for message input from music instruments
    this.udp = new OSC.UDPPort({
      localAddress: "0.0.0.0",
      localPort: this.port,
      metadata: true,
    });
    this.udp.open();
  }

  public onMessage(callback: (message: IOSCMessage) => void) {
    this.udp.on(UdpEvent.MESSAGE, (oscRawMsg: IOSCRawMessage, timeTag: any, info: any) => {
      const msg: IOSCMessage = {
        address: oscRawMsg.address,
        args: oscRawMsg.args,
        info: info,
      };
      callback(msg);
    });
  }
}
