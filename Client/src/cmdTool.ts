import inquirer from 'inquirer';
import Client from './oscclient';
import { logger, loggerD } from './tools';
import ConfigHandler from './configHandler';
import text from './visual_strings';

export default class CmdTool {
 
  private settings = {
    port: 57121,
    address: '127.0.0.1',
    path: "",
    args: new Array(),
  };
  private cli: any;
  private questions: Object[] = [
    {
      type: 'input',
      name: 'oscpath',
      message: text.msg_path,
    },
    {
      type: 'input',
      name: 'oscargs',
      message: text.msg_args,
    },
    {
      type: 'input',
      name: 'address',
      message: text.msg_address,
    },
    {
      type: 'input',
      name: 'port',
      message: text.msg_port,
    },
    {
      type: 'list',
      name: 'askNext',
      message: text.msg_menu,
      choices: [
        text.SEND,
        text.PLAY_NOTE,
        text.PLAY_SONG,
        text.DRUMS_MENU,
        text.SETTINGS_MENU,
        text.EXIT,
      ],
    },
    {
      type: 'list',
      name: 'asksettings',
      message: text.msg_settings_menu,
      choices: [
        text.CHANGE_PATH, 
        text.CHANGE_ARGS,
        text.CHANGE_ADDRESS, 
        text.CHANGE_PORT,
        text.BACK,
      ],
    },
    {
      type: 'list',
      name: 'askdrums',
      message: text.msg_menu_drums,
      choices: [
        text.START_DRUMLOOP,
        text.STOP_DRUMLOOP,
        text.BACK,
      ],
    },
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
    const regex = /\/[A-Za-z_]+$/;
    if (str.match(regex)) {
      return true;
    }
    return false;
  }

  private validOSCArgs(str: string): boolean {
    const regex = /^[isfb]+,[A-Za-z0-9]+$/;
    if (str.match(regex)) {
      return true;
    }
    return false;
  }

  private validAddress(str: string): boolean {
    const regex = /^[0-9]+[.][0-9]+[.][0-9]+[.][0-9]+$/;
    if (str.match(regex)) {
      return true;
    }
    return false;
  }

  private validPort(str: string): boolean {
    const regex = /^[0-9]+$/;
    if (str.match(regex)) {
      return true;
    }
    return false;
  }

  private createCli() {
    loggerD('no client defined');
    this.cli = new Client(
      this.settings.address, this.settings.port,
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
        const { oscpath } = answers;
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
        const { oscargs } = answers;
        if (!this.validOSCArgs(oscargs)) {
          logger('wrong args syntax');
          return this.changeArgs();
        }
        const tmpAr = oscargs.split(',');
        const argsObj = {
          type: tmpAr[0], value: tmpAr[1],
        };
        this.settings.args.pop();
        this.settings.args.push(argsObj);
        this.menu();
      });
  }

  private changeAddress() {
    inquirer.prompt(this.questions[2])
      .then((answers: { address: string; }) => {
        const { address } = answers;
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
        const { port } = answers;
        if (!this.validPort(port)) {
          logger('wrong port syntax');
          return this.changePort();
        }
        const parsed = parseInt(port, 10);
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
    const { path, args } = this.settings;
    if (!this.cli) {
      this.createCli();
    }

    const deli = this.cli.send(path, args);
    if (!deli) {
      logger('OSC msg could not be send');
      return this.menu();
    }
    logger('OSC msg send.');
    return this.menu();
  }

  private playAmelie() {
    if (!this.cli) {
      this.createCli();
    }
    this.cli.playAmelie();
    this.menu();
  }

  private playRandomNote() {
    if (!this.cli) {
      this.createCli();
    }
    this.cli.send('/play_note', [{ type: 's', value: 'C2' }]);
    this.menu();
  }

  public menu() {
    logger(JSON.stringify(this.settings, undefined, 2));
    inquirer.prompt(this.questions[4])
      .then((answers: { askNext: string; }) => {
        const { askNext } = answers;
        switch (askNext) {
          case text.SEND: return this.send();
          case text.PLAY_NOTE: return this.playRandomNote();
          case text.SETTINGS_MENU: return this.settingsMenu();
          case text.DRUMS_MENU: return this.drumMenu();
          case text.EXIT: return this.exitConsole();
          case text.PLAY_SONG: return this.playAmelie();
          default: return this.menu();
        }
      });
  }

  public settingsMenu() {
    logger(JSON.stringify(this.settings, undefined, 2));
    inquirer.prompt(this.questions[5])
      .then((answers: { asksettings: string; }) => {
        switch (answers.asksettings) {
          case text.CHANGE_ADDRESS: return this.changeAddress();
          case text.CHANGE_PORT: return this.changeAddress();
          case text.CHANGE_PATH: return this.changePath();
          case text.CHANGE_ARGS: return this.changeArgs();
          case text.BACK: return this.menu();
          default: return this.menu();
        }
      });
  }

  public drumMenu() {
    logger(JSON.stringify(this.settings, undefined, 2));
    inquirer.prompt(this.questions[6])
      .then((answers: { askdrums: string; }) => {
        switch (answers.askdrums) {
          case text.START_DRUMLOOP:
            this.cli.startDrumLoop();
            return this.drumMenu();
          case text.STOP_DRUMLOOP:
            this.cli.stopDrumLoop();
            return this.drumMenu();
          case text.BACK: return this.menu();
          default: return this.menu();
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
