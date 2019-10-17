import { OSCArgs, OSCMessage, OSCRawMessage } from "./osc-message";
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
  private udp: OSC.UdpSocket;
  private readonly outputIp: string;
  private readonly outputPort: number;

  constructor(ip: string, port: number, outputIp: string, outputPort: number) {
    // prepares udp socket for message input from music instruments
    this.udp = new _osc.UDPPort({
      localAddress: ip,
      localPort: port,
      remotePort: 4559,
      remoteAddress: "192.168.0.241",
      metadata: true
    });

    // save address to sonic pi
    this.outputIp = outputIp;
    this.outputPort = outputPort;
  }

  // connects to the udp socket
  public connect() {
    this.udp.open();
    console.log("Connected successfully!");
  }

  // allows you to add handlers that get executed when a osc message arrives from the instruments
  public addMessageListener(handler: ((oscMsg: OSCMessage) => void)) {
    const func = (oscRawMsg: OSCRawMessage, timeTag: any, info: any) => {
      const _msg = new OSCMessage(oscRawMsg.address, oscRawMsg.args, info);
      handler(_msg);
    };
    this.udp.on("message", func);
    console.log("Added message listener");
  }

  // allows you to send osc messages to sonic pi
  public send() {
    this.udp.on("ready", _ => {
      console.log("Send message to Sonic Pi");

      const note: OSCArgs = {
        type: "i",
        value: 60
      };

      this.udp.send({
        address: "/play/piano",
        args: [ note ]
      }, this.outputIp, this.outputPort);
    });
  }
}