import inquirer from 'inquirer';
import Client from './client';
import { logger } from './tools';
import ConfigHandler from './configHandler';

export default class CmdTool {
    private EXIT: string = 'exit';
    private BACK: string = 'go back...';
    private DRUMS: string = 'drums menu...';
    private SETTINGS: string = 'change settings...'
    private PLAYNOTE: string = 'play random note';
    private CHANGEADDRESS: string = 'change address';
    private CHANGEPORT: string = 'change port';
    private CHANGEPATH: string = 'change osc path';
    private CHANGEARGS: string = 'change osc args';
    private SEND: string = 'send (again)';
    private PLAYAMELIE: string = 'play song';
    private STARTDRUMLOOP: string = 'starts a drum loop';
    private STOPDRUMLOOP: string = 'stops the running drum Loop';

    private settings = {
        port: 57121,
        address: '127.0.0.1',
        path: "",
        args: new Array(),
    };
    private cli: any;
    private questions: Array<Object> = [
        {
            type: 'input',
            name: 'oscpath',
            message: 'Enter OSC-Path:'
        },
        {
            type: 'input',
            name: 'oscargs',
            message: 'Enter OSC-args (format: "type,value" ):',
        },        
        {
            type: 'input',
            name: 'address',
            message: 'Enter address of the OSC Server:'
        },
        {
            type: 'input',
            name: 'port',
            message: 'Enter port of the OSC Server:'
        },
        {
            type: 'list',
            name: 'askNext',
            message: 'Menu:',
            choices: [
                this.SEND,
                this.PLAYNOTE,
                this.PLAYAMELIE,                
                this.DRUMS,
                this.SETTINGS,                
                this.EXIT
            ]
        },
        {
            type: 'list',
            name: 'asksettings',
            message: 'Settings-Menu:',
            choices: [
                this.CHANGEPATH, this.CHANGEARGS,
                this.CHANGEADDRESS, this.CHANGEPORT,
                this.BACK,
            ]
        },
        {
            type: 'list',
            name: 'askdrums',
            message: 'Drums-Menu:',
            choices: [
                this.STARTDRUMLOOP,
                this.STOPDRUMLOOP,
                this.BACK,
            ]
        }
    ];
    private configHandler: any;
    private ft: boolean = true;

    constructor() {
        this.configHandler = new ConfigHandler();
        if (this.configHandler.existsFile()) {
            this.settings = this.configHandler.loadData();
            this.ft = false;
        }
        this.createCli();
    }

    private validOSCPath(str: string): boolean {
        let regex = /\/[A-Za-z_]+$/;
        if (str.match(regex)) return true;
        return false;
    }

    private validOSCArgs(str: string): boolean {
        let regex = /^[isfb]+,[A-Za-z0-9]+$/;
        if (str.match(regex)) return true;
        return false;
    }

    private validAddress(str: string): boolean {
        let regex = /^[0-9]+[.][0-9]+[.][0-9]+[.][0-9]+$/;
        if (str.match(regex)) return true;
        return false;
    }

    private validPort(str: string): boolean {
        let regex = /^[0-9]+$/;
        if (str.match(regex)) return true;
        return false;
    }

    private createCli() {
        logger('no client defined', { debug: true })
        this.cli = new Client(
            this.settings.address, this.settings.port
        );
    }

    private closeCli() {
        this.cli.close();
        this.cli = undefined;
    }

    public init() {
        if (this.ft) {
            this.changePath(true);
        } else {
            this.menu();
        }
    }

    private changePath(ft: boolean = false) {
        inquirer.prompt(this.questions[0])
            .then((answers: { oscpath: string; }) => {
                let { oscpath } = answers;
                if (oscpath == 'exit') this.exitConsole();
                if (!this.validOSCPath(oscpath)) {
                    logger("wrong path syntax");
                    return this.changePath(ft);
                }
                this.settings.path = oscpath;
                (ft) ? this.changeArgs() : this.menu();
            });
    }

    private changeArgs() {
        inquirer.prompt(this.questions[1])
            .then((answers: { oscargs: string; }) => {
                let { oscargs } = answers;
                if (oscargs == 'exit') this.exitConsole();
                if (!this.validOSCArgs(oscargs)) {
                    logger('wrong args syntax');
                    return this.changeArgs();
                }
                let tmpAr = oscargs.split(',');
                let argsObj = {
                    type: tmpAr[0], value: tmpAr[1]
                };
                this.settings.args.pop();
                this.settings.args.push(argsObj);
                this.menu();
            });
    }

    private changeAddress() {
        inquirer.prompt(this.questions[2])
            .then((answers: { address: string; }) => {
                let { address } = answers;
                if (!this.validAddress(address)) {
                    logger('wrong address syntax');
                    return this.changeAddress();
                }
                this.settings.address = address;
                if (this.cli) {
                    this.closeCli();
                }
                this.menu();
            });
    }

    private changePort() {
        inquirer.prompt(this.questions[3])
            .then((answers: { port: string; }) => {
                let { port } = answers;
                if (!this.validPort(port)) {
                    logger('wrong port syntax');
                    return this.changePort();
                }
                let parsed = parseInt(port);
                if (isNaN(parsed)) {
                    logger('wrong port syntax');
                    return this.changePort();
                }
                this.settings.port = parsed;
                if (this.cli) {
                    this.closeCli();
                }
                this.menu();
            });
    }

    private send() {
        let { address, port, path, args } = this.settings;
        if (!this.cli) {
            this.createCli();
        }

        let deli = this.cli.send(path, args)
        if (!deli) {
            logger('OSC msg could not be send');
            return this.menu();
        }
        logger('OSC msg send.')
        return this.menu();
    }

    private playAmelie() {
        if (!this.cli) {
            this.createCli();
        }
        this.cli.playAmelie()
        this.menu();
    }

    private playRandomNote() {
        if (!this.cli) {
            this.createCli();
        }
        this.cli.send('/play_note', [{type:'s', value:'C2'}]);
        this.menu();
    }

    public menu() {
        logger(JSON.stringify(this.settings, undefined, 2));
        inquirer.prompt(this.questions[4])
            .then((answers: { askNext: string; }) => {
                let { askNext } = answers;
                switch (askNext) {
                    case this.SEND: return this.send();  
                    case this.PLAYNOTE: return this.playRandomNote();
                    case this.SETTINGS: return this.settingsMenu();
                    case this.DRUMS: return this.drumMenu()
                    case this.EXIT: return this.exitConsole();
                    case this.PLAYAMELIE: return this.playAmelie();
                    default: return this.menu();
                }
            });
    }

    public settingsMenu() {
        logger(JSON.stringify(this.settings, undefined, 2));
        inquirer.prompt(this.questions[5])
            .then((answers: { asksettings: string; }) => {
                switch (answers.asksettings) {                                      
                    case this.CHANGEADDRESS: return this.changeAddress();
                    case this.CHANGEPORT: return this.changeAddress();
                    case this.CHANGEPATH: return this.changePath();
                    case this.CHANGEARGS: return this.changeArgs();
                    case this.BACK: return this.menu();
                    default: return this.menu();
                }
            });
    }

    public drumMenu() {
        logger(JSON.stringify(this.settings, undefined, 2));
        inquirer.prompt(this.questions[6])
            .then((answers: { askdrums: string; }) => {
                switch (answers.askdrums) {                                      
                    case this.STARTDRUMLOOP: 
                        this.cli.startDrumLoop();
                        return this.drumMenu();
                    case this.STOPDRUMLOOP: 
                        this.cli.stopDrumLoop();
                        return this.drumMenu();
                    case this.BACK: return this.menu();
                    default: return this.menu();
                }
            });
    }

    private exitConsole() {
        this.configHandler.storeData(this.settings,
            () => {
                logger('exited oscclient successfully', { debug: true });
                process.exit();
            });
    }
}