import { OSCMessage, IOSCRawMessage } from "./osc-message";
import { OSCInputMessage } from "./osc-input-message";
import { Logger } from '@overnightjs/logger';
import * as OSC from 'osc';

export class OSCServer {
  private udp: OSC.UDPPort; // socket communication between us and music instruments
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

  // allows you to add handlers that get executed when a osc message arrives from the instruments
  public addMessageListener(handler: ((oscMsg: OSCInputMessage) => void)) {
    const func = (oscRawMsg: IOSCRawMessage, timeTag: any, info: any) => {
      const _msg = new OSCInputMessage(oscRawMsg.address, oscRawMsg.args, info);
      handler(_msg);
    };
    this.udp.on("message", func);
    Logger.Info('Added message listener');
  }

  // allows you to send osc messages to sonic pi
  public sendMessage(msg: OSCMessage) {
    const rawMsg: IOSCRawMessage = {
      address: msg.getAddress(),
      args: msg.getArgs(),
    };

    this.udp.send(rawMsg, this.outputIp, this.outputPort);
  }

  public getIO(): OSC.UDPPort {
    return this.udp;
  }
}
