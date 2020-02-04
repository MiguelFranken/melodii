import { Controller, Message, OnMessage } from "../decorator/decorators";
import { IOSCMessage } from "../osc/osc-message";
import { MusicService } from '../music.service';
import { PlayNoteSynth } from '../instruments/playnote_synth';
import { OSCError } from '../error';
import { TypeChecker } from '../type-checker';
import { Logger } from '@upe/logger';

@Controller('/play_note')
export class PlayNoteController {

  private logger: Logger = new Logger({ name: 'PlayNoteController', flags: ['controller'] });

  private synth: PlayNoteSynth;

  constructor(private music: MusicService) {
    this.synth = music.getInstrument('playnote-synth') as PlayNoteSynth;
  }

  /**
   * @apiGroup PlayNoteSynth
   * @apiName Plays a note
   * @apiDesc Trigger and Release a note
   * @apiPath /play_note
   * @apiArgs s,note Expects a note as string
   * @apiArgs s,duration Expects the duration of the note as string
   * @apiArgs f,velocity Expects the velocity [0,1] of the note as float
   */
  @OnMessage()
  public receivedMessage(@Message() msg: IOSCMessage) {
    try {
      const note = TypeChecker.ValidNoteArg(msg.args[0]);
      const duration = TypeChecker.ValidDurationArg(msg.args[1]);
      const velocity = TypeChecker.ValidNormalRangeArg(msg.args[2]);

      this.synth.triggerRelease(note, duration, velocity);
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
        e.printFrontend(this.music.getLogService());
      }
    }
  }

  /**
   * @apiGroup PlayNoteSynth
   * @apiName Start playing a note
   * @apiDesc Triggers a note to start playing
   * @apiPath /play_note/trigger
   * @apiArgs s,index Expects a note as a string
   * @apiArgs f,velocity Expects the velocity [0,1] of the note as float
   */
  @OnMessage('/trigger')
  public receivedMessageStart(@Message() msg: IOSCMessage) {
    try {
      const note = TypeChecker.ValidNoteArg(msg.args[0]);
      const velocity = TypeChecker.ValidNormalRangeArg(msg.args[1]);

      this.synth.trigger(note, velocity);
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
        e.printFrontend(this.music.getLogService());
      }
    }
  }

  /**
   * @apiGroup PlayNoteSynth
   * @apiName Detune the PlayNoteSynth
   * @apiDesc Shift the pitch of all notes
   * @apiPath /play_note/detune
   * @apiArgs i,cents Expects the pitch-shift in cents as integer
   */
  @OnMessage('/detune')
  public detune(@Message() msg: IOSCMessage) {
    try {
      const note = TypeChecker.ValidNoteArg(msg.args[0]);
      const cents = TypeChecker.ValidCentsArg(msg.args[1]);

      this.synth.detune(note, cents);
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
        e.printFrontend(this.music.getLogService());
      }
    }
  }

  /**
   * @apiGroup PlayNoteSynth
   * @apiName Stop playing a note
   * @apiDesc Release a note to stop playing it
   * @apiPath /play_note/release
   * @apiArgs s,index Expects a note as string
   */
  @OnMessage('/release')
  public receivedMessageStop(@Message() msg: IOSCMessage) {
    try {
      const note = TypeChecker.ValidNoteArg(msg.args[0]);

      this.synth.release(note);
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
        e.printFrontend(this.music.getLogService());
      }
    }
  }

}
