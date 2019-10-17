import { OSCInputMessage, OSCMessage, OSCRawMessage } from "./osc-message";
const _osc = require("osc");

//region Type Definitions
declare namespace OSC {
  export class UdpSocket {
    open(): void;
    on(s: string, func: ((oscRawMsg: OSCRawMessage, timeTag: any, info: any) => void)): void;
    send(msg: OSCRawMessage, ip: string, port: number): void;
  }
}
//endregion

export class OSCServer {
  private udp: OSC.UdpSocket; // socket communication between us and music instruments
  private readonly outputIp: string; // sonic pi ip
  private readonly outputPort: number; // sonic pi port

  constructor(ip: string, port: number, outputIp: string, outputPort: number) {
    // prepares udp socket for message input from music instruments
    this.udp = new _osc.UDPPort({
      localAddress: ip,
      localPort: port,
      remotePort: outputPort,
      remoteAddress: outputIp,
      metadata: true
    });
    console.log(`Starting server on ip '${ip}' and port '${port}'..`);

    // save address to sonic pi
    this.outputIp = outputIp;
    this.outputPort = outputPort;
  }

  // connects to the udp socket
  public connect() {
    this.udp.open();
    console.log("Started server successfully!");
  }

  // allows you to add handlers that get executed when a osc message arrives from the instruments
  public addMessageListener(handler: ((oscMsg: OSCInputMessage) => void)) {
    const func = (oscRawMsg: OSCRawMessage, timeTag: any, info: any) => {
      const _msg = new OSCInputMessage(oscRawMsg.address, oscRawMsg.args, info);
      handler(_msg);
    };
    this.udp.on("message", func);
    console.log("Added message listener");
  }

  // allows you to send osc messages to sonic pi
  public sendMessage(msg: OSCMessage) {
    const rawMsg: OSCRawMessage = {
      address: msg.getAddress(),
      args: msg.getArgs()
    };

    this.udp.send(rawMsg, this.outputIp, this.outputPort);
  }
}
