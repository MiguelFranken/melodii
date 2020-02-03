import osc from 'osc';
import dns from 'dns';
import { IOSCArgs } from './osc/osc-types';
import { logger, loggerD } from './tools';

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

    public openUDP(): void {
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
    ): void {
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

    /**
     * sends the oscmessage if the udp client is ready to the osc server
     * @param path String
     * @param args IOSCArgs[]
     */
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

    public async playAmelie(): Promise<any> {
        // const arrNotes = [
        //     "E2", "G2", "B2", "A4",
        //     "E4", "A4", "G4", "A4",
        //     "D3", "A4", "G4", "A4",
        //     "D3", "A4", "G4", "A4",
        // ];
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

    public async playAmelieBox(): Promise<any> {
        const arrNotes2 = [
            "E4", "A4", "G4", "A4",
            "E4", "A4", "G4", "A4",
            "D3", "A4", "G4", "A4",
            "D3", "A4", "G4", "A4",
        ];
        for (let i = 0; i < 4 * 4; i++) {
            const args: IOSCArgs[] = [
                {type: "s", value: arrNotes2[i].toString()},
                // {type: "s", value: "8n"},
                {type: "f", value: 1},
            ];
            const args2: IOSCArgs[] = [
                {type: "s", value: arrNotes2[i].toString()},
            ];
            this.send("/box/trigger", args);
            await this.sleep(150);
            this.send("/box/release", args2);
            await this.sleep(150);
        }
    }

    public async playAmelieMat(): Promise<any> {
        const arrNotes2 = [
            1, 4, 3, 4,
            1, 4, 3, 4,
            0, 4, 3, 4,
            0, 4, 3, 4,
        ];
        for (let i = 0; i < 4 * 4; i++) {
            const args: IOSCArgs[] = [
                {type: "i", value: arrNotes2[i]},
                // {type: "s", value: "8n"},
                {type: "f", value: 1},
            ];
            const args2: IOSCArgs[] = [
                {type: "i", value: arrNotes2[i]},
            ];
            this.send("/mat/trigger", args);
            await this.sleep(150);
            this.send("/mat/release", args2);
            await this.sleep(150);
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
        const kick = "/drums/kick";
        const hihat = "/drums/hihat";
        const snare = "/drums/snare";
        const arg1: IOSCArgs = {
            type: "s", value: "8n",
        };
        const arg2: IOSCArgs = {
            type: "f", value: 1,
        };
        const pause = 350;
        const args: IOSCArgs[] = [arg1, arg2];
        while (this.drumLoop) {
            this.send(kick, args);
            this.send(hihat, args);
            await this.sleep(pause);
            this.send(hihat, args);
            await this.sleep(pause);
            this.send(snare, args);
            this.send(hihat, args);
            await this.sleep(pause);
            this.send(hihat, args);
            await this.sleep(pause);
            this.send(kick, args);
            this.send(hihat, args);
            await this.sleep(pause);
            this.send(kick, args);
            this.send(hihat, args);
            await this.sleep(pause);
            this.send(snare, args);
            this.send(hihat, args);
            await this.sleep(pause);
            this.send(hihat, args);
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
