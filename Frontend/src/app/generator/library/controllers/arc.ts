import { Controller, Message, OnMessage } from '../decorator/decorators';
import { IOSCMessage } from '../osc/osc-message';
import { Arc } from '../instruments/arc';
import { Logger } from '@upe/logger';
import { MusicService } from '../music.service';
import { TypeChecker } from '../type-checker';
import { OSCError } from '../error';
import { Note } from '../types';

@Controller('/arc')
export class ArcController {

  private logger: Logger = new Logger({ name: 'ArcController', flags: ['music'] });

  private arc: Arc;

  private mapping: Map<string, boolean> = new Map();
  private useVelocity = true;
  private isVelocityReversed = false;

  constructor(private music: MusicService) {
    this.arc = music.getInstrument("arc") as Arc;
    this.initMap();
  }

  private initMap() {
    this.mapping.set("C", true);
    this.mapping.set("C#", true);
    this.mapping.set("D", true);
    this.mapping.set("D#", true);
    this.mapping.set("E", true);
    this.mapping.set("F", true);
    this.mapping.set("G", true);
    this.mapping.set("G#", true);
    this.mapping.set("A", true);
    this.mapping.set("A#", true);
    this.mapping.set("B", true);
  }

  /**
   * @apiGroup Arc
   * @apiName Set
   * @apiDesc Sets the volume of the note
   * @apiPath /arc/set
   * @apiArgs s,note Expects a note as string
   * @apiArgs f,strength Expects the strength in [0, 1] of the note as a float
   */
  @OnMessage('/set')
  public trigger(@Message() message: IOSCMessage) {
    try {
      const { args } = message;
      const note = TypeChecker.ValidNoteArg(args[0]);
      let strength: any;
      if (args[1].value === 0) {
        strength = 0;
      } else {
        if (this.useVelocity) {
          if (this.isVelocityReversed) {
            strength = 1 - (args[1].value as number);
          } else {
            strength = args[1].value; // TODO: Validate strength
          }
        } else {
          strength = 1;
        }
      }

      if (this.mapping.get(note.substr(0, note.length - 1))) {
        this.arc.set(note, strength);
        this.logger.info('Set', { note, strength });
      } else {
        this.logger.debug('Trying to set note that is deactivated', { note, strength });
      }
    } catch (e) {
      this.printError(e);
    }
  }

  /**
   * @apiGroup Arc
   * @apiName Activate/deactivate note
   * @apiDesc Activates/deactivates a specific note
   * @apiPath /arc/switch/velocity
   * @apiArgs s,note Expects a note as string without octave at the end
   * @apiArgs i,state Expects a boolean as integer
   */
  @OnMessage('/switch/note')
  public switchNote(@Message() message: IOSCMessage) {
    try {
      const { args } = message;
      const note: Note = TypeChecker.ValidNoteWithoutOctaveArg(args[0]);
      const state: boolean = TypeChecker.ValidBoolArg(args[1]);

      if (!state) {
        this.arc.set(note + "1", 0);
        this.arc.set(note + "2", 0);
        this.arc.set(note + "3", 0);
        this.arc.set(note + "4", 0);
        this.arc.set(note + "5", 0);
      }
      this.mapping.set(note, state);

      this.logger.info(`Switched note`, { note, state });
    } catch (e) {
      this.printError(e);
    }
  }

  /**
   * @apiGroup Arc
   * @apiName Activate/deactivate velocity
   * @apiDesc Activates/deactivates whether the arc instrument can send velocity for notes
   * @apiPath /arc/switch/velocity
   * @apiArgs i,state Expects a boolean as integer
   */
  @OnMessage('/switch/velocity')
  public switchVelocity(@Message() message: IOSCMessage) {
    try {
      const { args } = message;
      this.useVelocity = TypeChecker.ValidBoolArg(args[0]);
    } catch (e) {
      this.printError(e);
    }
  }

  /**
   * @apiGroup Arc
   * @apiName Activate/deactivate velocity reversed mode
   * @apiDesc Activates/deactivates whether the sent velocity values are reversed
   * @apiPath /arc/switch/reversed
   * @apiArgs i,state Expects a boolean as integer
   */
  @OnMessage('/switch/reversed')
  public switchVelocityReversed(@Message() message: IOSCMessage) {
    try {
      const { args } = message;
      this.isVelocityReversed = TypeChecker.ValidBoolArg(args[0]);
    } catch (e) {
      this.printError(e);
    }
  }

  private printError(e: any) {
    if (e instanceof OSCError) {
      e.print(this.logger);
      e.printFrontend(this.music.getLogService());
    } else {
      this.logger.error("Unidentifiable error", e);
    }
  }

}
