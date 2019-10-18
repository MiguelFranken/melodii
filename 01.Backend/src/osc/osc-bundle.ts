import { OSCMessage } from "./osc-message";

/**
 * OSC bundle objects consist of a time tag and an array of packets.
 * Packets can be a mix of OSC bundle objects and message objects.
 */
export class OSCBundle {
  private timeTag: any;
  private packets: OSCBundle | OSCMessage;

  constructor(timeTag: any, packets: OSCBundle | OSCMessage) {
    this.timeTag = timeTag;
    this.packets = packets;
  }
}