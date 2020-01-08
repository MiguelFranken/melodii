import inquirer from 'inquirer';
import { OSCClient } from './oscclient';
import { logger, loggerD } from './tools';
import { ConfigHandler } from './configHandler';
import text from './visual_strings';
import questions from './questions';
import { IOSCArgs } from "./osc/osc-types";
import { OSCTypeTag } from "./osc/osc-types";

export default class CmdTool {
    private regex = {
        url: /^[A-za-z0-9-:./]+$/,
        path: /\/[A-Za-z_]+$/,
        args: /^[isfb]+,[A-Za-z0-9.]+$/,
        address: /^[0-9]+[.][0-9]+[.][0-9]+[.][0-9]+$/,
        port: /^[0-9]+$/,
        number: /^[0-9]+$/,
    };
    private args: IOSCArgs[] = [];
    private readonly settings = {
        port: 57121,
        address: "",
        path: "",
        args: this.args,
        url: "mcp-dev.miguel-franken.com",
    };
    private cli: OSCClient = new OSCClient(this.settings.address, this.settings.port);
    private configHandler: any;
    private readonly ft: boolean = true;
    private loading: boolean = false;

    constructor() {
        this.configHandler = new ConfigHandler();
        if (this.configHandler.existsFile()) {
            this.settings = this.configHandler.loadData();
            this.ft = false;
        }
        this.cli = new OSCClient(
            this.settings.address,
            this.settings.port,
        );
        //console.log("constructor: first time: " + this.ft);
    }

    private static validString(str: string, r: RegExp): boolean {
        return !!(str.match(r));
    }

    public init() {
        if (this.ft) {
            this.cli.dnslookup(this.settings.url, (err, address) => {
                if (err) {
                    logger("dnsLookup unsuccessful");
                    this.menu();
                }
                this.settings.address = address;
                this.cli.setAddress(address);
            });
            this.cli.openUDP();
            this.changePath(true);
        } else {
            this.cli.openUDP();
            this.menu();
        }
    }

    private changePath(ft: boolean = false) {
        inquirer.prompt(questions[0])
            .then((answers: { oscPath: string; }) => {
                const {oscPath} = answers;
                if (!CmdTool.validString(oscPath, this.regex.path)) {
                    logger("wrong path syntax");
                    return this.changePath(ft);
                }
                this.settings.path = oscPath;
                (ft) ? this.changeArgs() : this.menu();
            });
    }

    private addAnotherArg() {
        inquirer.prompt(questions[7])
            .then((answers: { anotherArg: string; }) => {
                const {anotherArg} = answers;
                if (anotherArg) {
                    this.changeArgs();
                } else {
                    this.menu();
                }
            });
    }

    private changeArgs(ft: boolean = false) {
        inquirer.prompt(questions[1])
            .then((answers: { oscArgs: string; }) => {
                const {oscArgs} = answers;
                if (!CmdTool.validString(oscArgs, this.regex.args)) {
                    logger('wrong args syntax');
                    return this.changeArgs();
                }
                const tmpAr = oscArgs.split(',');
                let type: OSCTypeTag = "s";
                let value: string | number = tmpAr[1].toString();
                switch (tmpAr[0]) {
                    case "i":
                        type = "i";
                        value = parseInt(value);
                        break;
                    case "f":
                        type = "f";
                        value = parseFloat(value);
                        break;
                    case "b":
                        type = "b";
                        break;
                }

                const arg: IOSCArgs = {
                    type, value,
                };
                if (ft) {
                    this.settings.args = [];
                }
                this.settings.args.push(arg);
                this.addAnotherArg();
            });
    }

    private changeAddress() {
        inquirer.prompt(questions[2])
            .then((answers: { address: string; }) => {
                const {address} = answers;
                let parsed = "";
                if (!CmdTool.validString(address, this.regex.address)) {
                    logger(address);
                    logger("ich bin hier");
                    if (CmdTool.validString(address, this.regex.url)) {
                        const url = address;
                        this.loading = true;
                        logger("dns lookup please wait");
                        this.cli.dnslookup(url, (err, address) => {
                            if (err) {
                                logger("dnsLookup unsuccessful");
                                this.menu();
                            }
                            this.settings.url = url;
                            this.settings.address = address;
                            this.cli.setAddress(address);
                            this.menu();
                        });
                        return;
                    } else {
                        logger('wrong address syntax');
                        return this.changeAddress();
                    }
                } else {
                    parsed = address;
                }
                this.settings.address = parsed;
                this.cli.setAddress(parsed);
                this.menu();
            });
    }

    private changePort() {
        inquirer.prompt(questions[3])
            .then((answers: { port: string; }) => {
                const {port} = answers;
                if (!CmdTool.validString(port, this.regex.port)) {
                    logger('wrong port syntax');
                    return this.changePort();
                }
                const parsed = parseInt(port, 10);
                if (isNaN(parsed)) {
                    logger('wrong port syntax');
                    return this.changePort();
                }
                this.settings.port = parsed;
                this.cli.setPort(parsed);
                this.menu();
            });
    }

    private send() {
        const {path, args} = this.settings;

        const deli = this.cli.send(path, args);
        if (!deli) {
            logger('OSC msg could not be send');
            return this.menu();
        }
        logger('OSC msg send.');
        return this.menu();
    }

    private playSong() {
        this.cli.playAmelie().then().catch();
        this.menu();
    }

    private playRandomNote() {
        const arg1: IOSCArgs = {
            type: "s", value: "C4",
        };
        const arg2: IOSCArgs = {
            type: "s", value: "8n",
        };
        const arg3: IOSCArgs = {
            type: "f", value: 1,
        };
        const args: IOSCArgs[] = [arg1, arg2, arg3];
        this.cli.send('/play_note', args).then().catch();
        this.menu();
    }

    public menu() {
        logger(JSON.stringify(this.settings, undefined, 2));
        inquirer.prompt(questions[4])
            .then((answers: { askNext: string; }) => {
                const {askNext} = answers;
                switch (askNext) {
                    case text.SEND:
                        return this.send();
                    case text.PLAY_NOTE:
                        return this.playRandomNote();
                    case text.SETTINGS_MENU:
                        return this.settingsMenu();
                    case text.DRUMS_MENU:
                        return this.drumMenu();
                    case text.EXIT:
                        return this.exitConsole();
                    case text.PLAY_SONG:
                        return this.playSong();
                    default:
                        return this.menu();
                }
            });
    }

    public settingsMenu() {
        logger(JSON.stringify(this.settings, undefined, 2));
        inquirer.prompt(questions[5])
            .then((answers: { askSettings: string; }) => {
                switch (answers.askSettings) {
                    case text.CHANGE_ADDRESS:
                        return this.changeAddress();
                    case text.CHANGE_PORT:
                        return this.changePort();
                    case text.CHANGE_PATH:
                        return this.changePath();
                    case text.CHANGE_ARGS:
                        return this.changeArgs(true);
                    case text.BACK:
                        return this.menu();
                    default:
                        return this.menu();
                }
            });
    }

    public drumMenu() {
        logger(JSON.stringify(this.settings, undefined, 2));
        inquirer.prompt(questions[6])
            .then((answers: { askDrums: string; }) => {
                switch (answers.askDrums) {
                    case text.START_DRUM_LOOP:
                        this.cli.startDrumLoop();
                        return this.drumMenu();
                    case text.STOP_DRUM_LOOP:
                        this.cli.stopDrumLoop();
                        return this.drumMenu();
                    case text.BACK:
                        return this.menu();
                    default:
                        return this.menu();
                }
            });
    }

    private exitConsole() {
        this.configHandler.storeData(this.settings,
            () => {
                loggerD('exited oscclient successfully');
                process.exit();
            });
    }
}
