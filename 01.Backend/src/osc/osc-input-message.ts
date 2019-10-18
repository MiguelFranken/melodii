import { IOSCArgs, IOSCInfo, OSCMessage } from './osc-message';

export class OSCInputMessage extends OSCMessage {
  private readonly info: IOSCInfo;

  constructor(address: string, args: IOSCArgs[], info: IOSCInfo) {
    super(address, args);
    this.info = info;
  }

  public getInfo(): IOSCInfo {
    return this.info;
  }
}
