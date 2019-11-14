import * as OSC from 'osc';
import {logger} from './tools';

export default class Client {
  private udpClient: any;
  private port: number;
  private address: string;
  private portReady: boolean = false;

  constructor(address: string, port: number) {
    this.port = port;
    this.address = address;
    this.udpClient = new OSC.UDPPort({
      localAddress: "0.0.0.0",
      localPort: 57333,
      metadata: false
    });
    logger('udpClient initialized successfully', {debug:true});
    this.udpClient.open();
    logger('udp port open()', {debug:true});
    this.udpClient.on("ready", () => {
      logger('port is ready', {debug:true});
      
      this.portReady = true;
    });
  }

  private sleep(ms: number): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    });
  }

  public async send(path: string, args: Array<Object>) {
    logger('path: ' + path, {debug:true});
    let counter = 0;
    while (!this.portReady) {
      
      ++counter;
      await this.sleep(50);  
      if (counter == 20) {
        return false;
      }
    } 
    
    this.udpClient.send(
      {
        address: path,
        args: args
      },
      this.address,
      this.port
    );
    return true;
  }

  // E2 G2 B2
  public async playAmelie(): Promise<any> {
    var arrNotes = [
      "E2", "G2", "B2", "A4",
      "E4", "A4", "G4", "A4",
      "D3", "A4", "G4", "A4",
      "D3", "A4", "G4", "A4",
    ];
    var arrNotes2 = [
      "E4", "A4", "G4", "A4",
      "E4", "A4", "G4", "A4",
      "D3", "A4", "G4", "A4",
      "D3", "A4", "G4", "A4",
    ];
    for (let i = 0; i < 3; i++) {
      let arg1 = { type: "s", value: arrNotes[i] }
      this.send("/play_note", [arg1]);
      await this.sleep(300);
    }
  }

  public async checkPianoSynthVsNormalSynth(): Promise<any> {
    let args = [
      { type: 's', value: 'C4' },
    ]
    this.send('/play_note', args);
    await this.sleep(500);
    this.send('/piano/play_note', args);
    await this.sleep(300);
  }

  public close():void {
    this.udpClient.close();
    logger('closed udpClient', {debug:true});    
  }
}