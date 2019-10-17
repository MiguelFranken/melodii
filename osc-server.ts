import { OSCMessage, OSCRawMessage } from "./osc-message";
const _osc = require("osc");

export class OSCServer {
  private udp: any; // udp socket

  // prepares udp socket
  public setup(ip: string, port: number) {
    console.log("Setting up OSC server..");
    this.udp = new _osc.UDPPort({
      localAddress: ip,
      localPort: port,
      metadata: true
    });
  }

  // connects to the udp socket
  public connect() {
    this.udp.open();
    console.log("Connected successfully!");
  }

  public addMessageListener(handler: ((oscMsg: OSCMessage) => void)) {
    const func = (oscRawMsg: OSCRawMessage, timeTag: any, info: any) => {
      const _msg = new OSCMessage(oscRawMsg.address, oscRawMsg.args, info);
      handler(_msg);
    };
    this.udp.on("message", func);
    console.log("Added message listener");
  }
}