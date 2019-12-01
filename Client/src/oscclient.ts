import * as OSC from 'osc';
import { logger, loggerD } from './tools';

// just a comment

export default class Client {
  private udpClient: any;
  private port: number;
  private address: string;
  private portReady: boolean = false;
  private drumLoop = false;

  constructor(address: string, port: number) {
    this.port = port;
    this.address = address;
    this.udpClient = new OSC.UDPPort({
      localAddress: "0.0.0.0",
      localPort: 57333,
      metadata: false,
    });
    loggerD('udpClient initialized successfully');
    this.udpClient.open();
    loggerD('udp port open()');
    this.udpClient.on("ready", () => {
      loggerD('port is ready');

      this.portReady = true;
    });
  }

  private sleep(ms: number): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  public async send(path: string, args: object[]) {
    let counter = 0;
    while (!this.portReady) {

      ++counter;
      await this.sleep(50);
      if (counter === 20) {
        return false;
      }
    }

    this.udpClient.send(
      {
        address: path,
        args: args,
      },
      this.address,
      this.port,
    );
    return true;
  }

  // E2 G2 B2
  public async playAmelie(): Promise<any> {
    const arrNotes = [
      "E2", "G2", "B2", "A4",
      "E4", "A4", "G4", "A4",
      "D3", "A4", "G4", "A4",
      "D3", "A4", "G4", "A4",
    ];
    const arrNotes2 = [
      "E4", "A4", "G4", "A4",
      "E4", "A4", "G4", "A4",
      "D3", "A4", "G4", "A4",
      "D3", "A4", "G4", "A4",
    ];
    for (let i = 0; i < 4 * 4; i++) {
      const arg1 = { type: "s", value: arrNotes2[i] };
      this.send("/piano/play_note", [arg1]);
      await this.sleep(300);
    }
  }

  public startDrumLoop() {
    this.drumLoop = true;
    this.playDrumBeat();
  }

  public stopDrumLoop() {
    this.drumLoop = false;
  }

  private async playDrumBeat() {
    while (this.drumLoop) {
      this.send('/drums/kick', [{ type: 's', value: 'C2' }]);
      await this.sleep(700);
      this.send('/drums/snare', [{ type: 's', value: 'C2' }]);
      await this.sleep(700);
      this.send('/drums/kick', [{ type: 's', value: 'C2' }]);
      await this.sleep(350);
      this.send('/drums/kick', [{ type: 's', value: 'C2' }]);
      await this.sleep(350);
      this.send('/drums/snare', [{ type: 's', value: 'C2' }]);
      await this.sleep(700);
    }
  }

  public async checkPianoSynthVsNormalSynth(): Promise<any> {
    const args = [
      { type: 's', value: 'C4' },
    ];
    this.send('/play_note', args);
    await this.sleep(500);
    this.send('/piano/play_note', args);
    await this.sleep(300);
  }

  public close(): void {
    this.udpClient.close();
    loggerD('closed udpClient');
  }
}
