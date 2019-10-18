import { Optional } from "../util";
import { Logger } from '@overnightjs/logger';

//region Type Definitions
export interface IOSCRawMessage {
  address: string; // URL-style address path
  args: IOSCArgs[]; // Raw or type-annotated OSC arguments
}

export type OSCTypeTag = "i" | "f" | "s" | "b"; // int32, float32, OSC-string, OSC-blob

// see http://opensoundcontrol.org/spec-1_0
export interface IOSCArgs {
  type: OSCTypeTag; // OSC Type Tag String
  value: number; // todo: not only number!
}

export interface IOSCInfo {
  address: string; // ip address of music instrument
  family: string; // e.g. IPv4
  port: number;
  size: number; // size of the message
}

export type Control = "switch" | "slider" | "unknown";
//endregion

export class OSCMessage {
  /**
   * URL-style address path
   *
   * The OSC Address of an OSC Method is a symbolic name giving the full path to the
   * OSC Method in the OSC Address Space,starting from the root of the tree. An OSC
   * Method's OSC Address begins with the character '/' (forward slash), followed by
   * the names of all the containers, in order, along the path from the root of the
   * tree to the OSC Method, separated by forward slash characters, followed by the
   * name of the OSC Method. The syntax of OSC Addresses was chosen to match the
   * syntax of URLs.
   *
   * See http://opensoundcontrol.org/spec-1_0
   * and http://opensoundcontrol.org/spec-1_0-examples#OSCaddress
   */
  private readonly address: string;
  private readonly args: IOSCArgs[];

  constructor(address: string, args: IOSCArgs[]) {
    this.address = address;
    this.args = args;
  }

  public getArgs(): IOSCArgs[] {
    return this.args;
  }

  public getFirstArg(): Optional<IOSCArgs> {
    if (this.args.length > 0) {
      return this.args[0];
    } else {
      return null;
    }
  }

  public getAddress() {
    return this.address;
  }

  public getTypeString(): string {
    if (this.address === '/clean_switch_1') {
      return "Switch";
    } else {
      return this.address;
    }
  }

  public getType(): Control {
    if (this.address === '/clean_switch_1') {
      return "switch";
    } else if (this.address === '/clean_slider_1') {
      return "slider";
    } else {
      Logger.Err(`Control not found for address ${this.address}`);
      return "unknown";
    }
  }
}
