import { Controller, Message, OnMessage } from '../decorator/decorators';
import { IOSCMessage } from '../osc/osc-message';
import { Mat } from '../instruments/mat';
import { Logger } from '@upe/logger';
import { MusicService } from '../music.service';
import { TypeChecker } from '../type-checker';
import { OSCError } from '../error';
import deprecated from 'deprecated-decorator';

@Controller('/mat')
export class MatController {

  private logger: Logger = new Logger({ name: 'MatController', flags: ['music'] });

  private mat: Mat;

  constructor(private music: MusicService) {
    this.mat = music.getInstrument("mat") as Mat;
  }

  /**
   * @apiGroup Mat
   * @apiName Play a note
   * @apiDesc Plays a note for a fixed duration
   * @apiPath /mat/play
   * @apiArgs i,buttonIndex Expects a button index as integer
   * @apiArgs f,velocity Expects the velocity [0,1] of the note as float
   */
  @OnMessage('/play')
  @deprecated()
  public play(@Message() message: IOSCMessage) {
    try {
      const buttonIndex = TypeChecker.ValidIndexArg(this.mat.notes.length, message.args[0]);
      const velocity = TypeChecker.ValidNormalRangeArg(message.args[1]);

      this.mat.play(buttonIndex, velocity);
      this.logger.info('Trigger', { noteIndex: buttonIndex, velocity });
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
        e.printFrontend(this.music.getLogService());
      }
    }
  }

  /**
   * @apiGroup Mat
   * @apiName Start playing a note
   * @apiDesc Triggers a note to start playing
   * @apiPath /mat/trigger
   * @apiArgs i,index Expects an index between 0 and 7 as integer
   * @apiArgs f,velocity Expects the velocity [0,1] of the note as float
   */
  @OnMessage('/trigger')
  public trigger(@Message() message: IOSCMessage) {
    try {
      const buttonIndex = TypeChecker.ValidIndexArg(this.mat.notes.length, message.args[0]);
      const velocity = TypeChecker.ValidNormalRangeArg(message.args[1]);

      this.mat.trigger(buttonIndex, velocity);
      this.logger.info('Trigger', { buttonIndex, velocity });
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
        e.printFrontend(this.music.getLogService());
      }
    }
  }

  /**
   * @apiGroup Mat
   * @apiName Stop playing a note
   * @apiDesc Release a note to stop playing it
   * @apiPath /mat/release
   * @apiArgs i,index Expects an index between 0 and 7 as integer
   */
  @OnMessage('/release')
  public release(@Message() message: IOSCMessage) {
    try {
      const buttonIndex = TypeChecker.ValidIndexArg(this.mat.notes.length, message.args[0]);
      this.mat.release(buttonIndex);
      this.logger.info('Release', { buttonIndex });
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
        e.printFrontend(this.music.getLogService());
      }
    }
  }

  /**
   * @apiGroup Mat
   * @apiName Octave change
   * @apiDesc Changes the octave of all the playable notes
   * @apiPath /mat/change_octave
   * @apiArgs i,octave Expects a octave as integer value between 1 and 5
   */
  @OnMessage('/change_octave')
  public changeOctave(@Message() message: IOSCMessage) {
    try {
      const octave = TypeChecker.ValidOctaveArg(message.args[0]);
      this.mat.changeOctave(octave);
      this.logger.info('Changed octave', octave);
    } catch (e) {
      e.print(this.logger);
      e.printFrontend(this.music.getLogService());
    }
  }

  /**
   * @apiGroup Mat
   * @apiName Root note change
   * @apiDesc Changes the root note of the scale
   * @apiPath /mat/change_root
   * @apiArgs s,note Expects a note without octave (e.g. 'C' or 'Db') as string
   */
  @OnMessage('/change_root')
  public changeRootNote(@Message() message: IOSCMessage) {
    try {
      const note = TypeChecker.ValidNoteWithoutOctaveArg(message.args[0]);
      this.mat.changeRootNote(note);
      this.logger.info('Changed Root Note', note);
    } catch (e) {
      e.print(this.logger);
      e.printFrontend(this.music.getLogService());
    }
  }

  /**
   * @apiGroup Mat
   * @apiName Scale change
   * @apiDesc Changes the scale
   * @apiPath /mat/change_scale
   * @apiArgs s,scale Expects the scale as string (e.g. 'major' or 'minor')
   */
  @OnMessage('/change_scale')
  public changeScale(@Message() message: IOSCMessage) {
    try {
      const scale = TypeChecker.ValidScaleArg(message.args[0]);
      this.mat.changeScale(scale);
      this.logger.info('Changed scale', scale);
    } catch (e) {
      e.print(this.logger);
      e.printFrontend(this.music.getLogService());
    }
  }

  /**
   * @apiGroup Mat
   * @apiName Swap two button's notes
   * @apiDesc Swaps the notes that are assigned to the buttons with the provided indices
   * @apiPath /mat/swap
   * @apiArgs i,buttonIndex Expects a button index as integer
   * @apiArgs i,buttonIndex Expects a button index as integer
   */
  @OnMessage('/swap')
  public swap(@Message() message: IOSCMessage) {
    try {
      const first = TypeChecker.ValidIndexArg(this.mat.notes.length, message.args[0]);
      const second = TypeChecker.ValidIndexArg(this.mat.notes.length, message.args[1]);

      this.mat.swapMapping(first, second);
      this.logger.info('Swap', { first, second });
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
        e.printFrontend(this.music.getLogService());
      }
    }
  }

  /**
   * @apiGroup Mat
   * @apiName Switch Chord Mode
   * @apiDesc Activates/deactivates chord mode
   * @apiPath /mat/chords
   * @apiArgs i,state Expects a boolean that expresses whether chords should be played or not
   */
  @OnMessage('/chords')
  public switchChordMode(@Message() message: IOSCMessage) {
    try {
      this.mat.isInChordMode = TypeChecker.ValidBoolArg(message.args[0]);
      this.logger.info('Switch chord mode');
    } catch (e) {
      this.printError(e);
    }
  }

  @OnMessage('/switch')
  public switchSound(@Message() message: IOSCMessage) {
    try {
      const soundName: string = message.args[0].value as string; // TODO: Validation
      if (soundName === "synth") {
        this.mat.setSynthVoices();
        this.logger.info('Activated synth sound');
      } else {
        this.mat.setSawToothVoices();
        this.logger.info('Activated saw tooth sound');
      }
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
