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

  public mapping: Map<string, boolean> = new Map();

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
      const strength: any = args[1].value; // TODO: Validate strength

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
   * @apiPath /arc/switch
   * @apiArgs s,note Expects a note as string without octave at the end
   * @apiArgs i,state Expects a boolean as integer
   */
  @OnMessage('/switch')
  public switch(@Message() message: IOSCMessage) {
    try {
      const { args } = message;
      const note: Note = TypeChecker.ValidNoteWithoutOctaveArg(args[0]);
      const state: boolean = TypeChecker.ValidBoolArg(args[1]);

      if (!state) {
        this.arc.set(note, 0);
      }
      this.mapping.set(note, state);

      this.logger.info(`Switched note`, { note, state });
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
