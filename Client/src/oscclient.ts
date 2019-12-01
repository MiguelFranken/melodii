import osc from 'osc';
import { IOSCArgs } from './osc/osc-types';
import dns from 'dns';
import { logger, loggerD } from './tools';

// just a comment

export class OSCClient {
  private udpClient: any;
  private port: number;
  private address: string;
  private portReady: boolean = false;
  private drumLoop = false;

  constructor(address: string, port: number) {
    this.port = port;
    this.address = address;
    const udp = new osc.UDPPort({
      localAddress: "0.0.0.0",
      localPort: 57333,
      metadata: false,
    });
    udp.on("ready", () => {
      loggerD('port is ready');

      this.portReady = true;
    });
    loggerD('udpClient initialized successfully');

    loggerD('udp port open()');
    this.udpClient = udp;
  }

  public openUDP() {
    this.udpClient.open();
  }

  public setPort(port: number): void {
    this.port = port;
  }

  public setAddress(address: string): void {
    this.address = address;
  }

  public dnslookup(
    url: string, callback: (err: NodeJS.ErrnoException | null, address: string) => void,
  ) {
    let str = url;
    if (str.includes("http://")) {
      str = str.substring(7, str.length);
    }
    if (str.endsWith("/")) {
      str = str.substring(0, str.length - 1);
    }
    dns.lookup(str, (err, address, family) => {
      callback(err, address);
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

  public playRandomNote() {
    this.send(
      '/play_note',
      [{ type: 's', value: 'C4' }],
    );
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
      this.send('/drums/hihat', [{ type: 's', value: 'C2' }]);
      await this.sleep(350);
      this.send('/drums/hihat', [{ type: 's', value: 'C2' }]);
      await this.sleep(350);
      this.send('/drums/snare', [{ type: 's', value: 'C2' }]);
      this.send('/drums/hihat', [{ type: 's', value: 'C2' }]);
      await this.sleep(350);
      this.send('/drums/hihat', [{ type: 's', value: 'C2' }]);
      await this.sleep(350);
      this.send('/drums/kick', [{ type: 's', value: 'C2' }]);
      this.send('/drums/hihat', [{ type: 's', value: 'C2' }]);
      await this.sleep(350);
      this.send('/drums/kick', [{ type: 's', value: 'C2' }]);
      this.send('/drums/hihat', [{ type: 's', value: 'C2' }]);
      await this.sleep(350);
      this.send('/drums/snare', [{ type: 's', value: 'C2' }]);
      this.send('/drums/hihat', [{ type: 's', value: 'C2' }]);
      await this.sleep(350);
      this.send('/drums/hihat', [{ type: 's', value: 'C2' }]);
      await this.sleep(350);
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
