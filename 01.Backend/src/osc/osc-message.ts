import { IOSCArgs } from "./osc-types";

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

  public getAddress() {
    return this.address;
  }

}
