import { Optional } from "./util";

//region Type Definitions
export interface OSCRawMessage {
  address: string; // URL-style address path
  args: OSCArgs[]; // Raw or type-annotated OSC arguments
}

export type OSCTypeTag = "i" | "f" | "s" | "b"; // int32, float32, OSC-string, OSC-blob

// see http://opensoundcontrol.org/spec-1_0
export interface OSCArgs {
  type: OSCTypeTag; // OSC Type Tag String
  value: number; // todo: not only number!
}

export interface OSCInfo {
  address: string; // ip address of music instrument
  family: string; // e.g. IPv4
  port: number;
  size: number; // size of the message
}

export type Control = "switch" | "unknown";
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
   * See http://opensoundcontrol.org/spec-1_0 and http://opensoundcontrol.org/spec-1_0-examples#OSCaddress
   */
  private readonly address: string;
  private readonly args: OSCArgs[];

  constructor(address: string, args: OSCArgs[]) {
    this.address = address;
    this.args = args;
  }

  public getArgs(): OSCArgs[] {
    return this.args;
  }

  public getFirstArg(): Optional<OSCArgs> {
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
    if (this.address == '/clean_switch_1') {
      return "Switch";
    } else {
      return this.address;
    }
  }

  public getType(): Control {
    if (this.address == '/clean_switch_1') {
      return "switch";
    } else {
      return "unknown";
    }
  }
}

export class OSCInputMessage extends OSCMessage {
  private readonly info: OSCInfo;

  constructor(address: string, args: OSCArgs[], info: OSCInfo) {
    super(address, args);
    this.info = info;
  }

  public getInfo(): OSCInfo {
    return this.info;
  }
}