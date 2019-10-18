declare module 'osc' {

  export class UDPPort {
    constructor(configuration: any);
    public open(): void;
    public on(
      s: string,
      func: (
        (oscRawMsg: import("../osc/osc-message").IOSCRawMessage,
         timeTag: any, info: any) => void)): void;
    public send(msg: import("../osc/osc-message").IOSCRawMessage, ip: string, port: number): void;
  }

}
