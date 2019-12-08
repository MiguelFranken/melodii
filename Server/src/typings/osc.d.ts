declare module 'osc' {

  export class UDPPort {
    constructor(configuration: any);
    public open(): void;
    public on(
      s: string,
      func: (
        (oscRawMsg: import("../osc/osc-types").IOSCRawMessage,
         timeTag: any, info: any) => void)): void;
  }

}
