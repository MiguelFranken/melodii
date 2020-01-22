import * as dgram from 'dgram';
import * as osc from 'osc';
import { IOSCRawMessage } from "./osc/osc-types";
import { IOSCMessage } from "./osc/osc-message";
import { Logger } from "@overnightjs/logger";
import * as ip from 'ip';

enum UdpEvent {
  MESSAGE = "message",
}

export class UdpServer {
  private readonly udp: dgram.Socket; // for communication between us and music instruments
  private callbacks: Function[] = [];

  constructor(public readonly port: Port) {
    // prepares udp socket for message input from music instruments

    this.udp = dgram.createSocket('udp4');

    this.udp.on('listening', () => {
      const myIp = ip.address();
      Logger.Info(`[UDP] Started listening for OSC messages at ${myIp}:${this.port}`);
    });

    this.udp.on('message', (message, remote) => {
      let rawMsg: any;
      try {
        rawMsg = osc.readPacket(message, { metadata: true });
      } catch (error) {
        Logger.Err(`[UDP] Ignoring malformed OSC message \`${message}\`: ${error.message}`);
      }
      if (rawMsg) {
        const oscMessage: IOSCMessage = {
          address: rawMsg.address,
          args: rawMsg.args,
          info: null as any,
        };
        Logger.Info(`[UDP] Received message: ${JSON.stringify(oscMessage)}`);
        this.callbacks.forEach((c) => {
          c(oscMessage);
        });
      }
    });

    this.udp.bind(this.port, "0.0.0.0");

    this.udp.on('error', (error) => {
      Logger.Err(`Error in UDP server: ${error}`);
    });
  }

  public onMessage(callback: (message: IOSCMessage) => void) {
    this.callbacks.push(callback);
  }
}
