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

    public async send(path: string, args: IOSCArgs[]) {

        let counter = 0;
        if (!this.portReady) {
            do  {

                ++counter;
                await this.sleep(50);
                if (counter === 20) {
                    return false;
                }
            } while (!this.portReady);
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

    public sendLatencyTest() {
        const str = Date.now().toString();
        const arg: IOSCArgs = {
            type: "s", value: str,
        };
        this.send('/latency', [arg]);
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
            const args: IOSCArgs[] = [
                {type: "s", value: arrNotes2[i].toString()},
                {type: "s", value: "8n"},
                {type: "f", value: 1},
            ];
            this.send("/piano/play_note", args);
            await this.sleep(300);
        }
    }

    public startDrumLoop() {
        this.drumLoop = true;
        this.playDrumBeat().then().catch(); // nothing to do here because we want the drum beat playing while a boolean is set
    }

    public stopDrumLoop() {
        this.drumLoop = false;
    }

    private async playDrumBeat() {
        const arg1: IOSCArgs = {
            type: "s", value: "8n",
        };
        const arg2: IOSCArgs = {
            type: "f", value: 1,
        };
        const pause = 350;
        const args: IOSCArgs[] = [arg1, arg2];
        while (this.drumLoop) {
            this.send('/drums/kick', args);
            this.send('/drums/hihat', args);
            await this.sleep(pause);
            this.send('/drums/hihat', args);
            await this.sleep(pause);
            this.send('/drums/snare', args);
            this.send('/drums/hihat', args);
            await this.sleep(pause);
            this.send('/drums/hihat', args);
            await this.sleep(pause);
            this.send('/drums/kick', args);
            this.send('/drums/hihat', args);
            await this.sleep(pause);
            this.send('/drums/kick', args);
            this.send('/drums/hihat', args);
            await this.sleep(pause);
            this.send('/drums/snare', args);
            this.send('/drums/hihat', args);
            await this.sleep(pause);
            this.send('/drums/hihat', args);
            await this.sleep(pause);
        }
    }

    public async checkPianoSynthVsNormalSynth(): Promise<any> {
        const args: IOSCArgs[] = [
            {type: 's', value: 'C4'},
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
