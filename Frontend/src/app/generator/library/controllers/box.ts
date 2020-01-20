import { Controller, Message, OnMessage } from '../decorator/decorators';
import { IOSCMessage } from '../osc/osc-message';
import { Box } from '../instruments/box';
import { Logger } from '@upe/logger';
import { MusicService } from '../music.service';
import { TypeChecker } from '../type-checker';
import { OSCError } from '../error';

@Controller('/box')
export class BoxController {

  private logger: Logger = new Logger({ name: 'BoxController', flags: ['music'] });

  constructor(private music: MusicService, private box: Box) {
    music.addInstrument(box, "Box");
  }

  /**
   * @apiGroup Box
   * @apiName Start playing a note
   * @apiDesc Triggers a note to start playing
   * @apiPath /box/trigger
   * @apiArgs s,note Expects a note as string
   * @apiArgs f,velocity Expects the velocity [0,1] of the note as float
   */
  @OnMessage('/trigger')
  public trigger(@Message() message: IOSCMessage) {
    try {
      const note = TypeChecker.ValidNoteArg(message.args[0]);
      const velocity = TypeChecker.ValidNormalRangeArg(message.args[1]);

      this.box.trigger(note, velocity);
      this.logger.info('Trigger', { note, velocity });
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
        e.printFrontend(this.music.getLogService());
      }
    }
  }

  /**
   * @apiGroup Box
   * @apiName Detune the Box
   * @apiDesc Shift the pitch of all notes
   * @apiPath /box/detune
   * @apiArgs i,cents Expects the pitch-shift in cents as integer
   */
  @OnMessage('/detune')
  public detune(@Message() message: IOSCMessage) {
    try {
      const cents = TypeChecker.ValidCentsArg(message.args[0]);

      this.box.detune(cents);
      this.logger.info('Detune', { cents });
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
        e.printFrontend(this.music.getLogService());
      }
    }
  }

  /**
   * @apiGroup Box
   * @apiName Stop playing a note
   * @apiDesc Release a note to stop playing it
   * @apiPath /box/release
   * @apiArgs s,note Expects a note as string
   */
  @OnMessage('/release')
  public release(@Message() message: IOSCMessage) {
    try {
      const note = TypeChecker.ValidNoteArg(message.args[0]);
      this.box.release(note);
      this.logger.info('Release', note);
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
        e.printFrontend(this.music.getLogService());
      }
    }
  }

  /**
   * @apiGroup Box
   * @apiName Set the volume of the Box
   * @apiDesc Set the instrument-level volume
   * @apiPath /box/setVolume
   * @apiArgs f,loudness Expects the new loudness [0,1] as float
   */
  @OnMessage('/setVolume')
  public setVolume(@Message() message: IOSCMessage) {
    try {
      const loudness = TypeChecker.ValidVelocityArg(message.args[0]);
      this.box.setVolume(loudness);
      this.logger.info('Set volume', loudness);
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
        e.printFrontend(this.music.getLogService());
      }
    }
  }
}
