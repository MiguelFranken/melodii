import { Controller, Message, OnMessage } from '../decorator/decorators';
import { IOSCMessage } from '../osc/osc-message';
import { Mat } from '../instruments/mat';
import { Logger } from '@upe/logger';
import { MusicService } from '../music.service';
import { TypeChecker } from '../type-checker';
import { OSCError } from '../error';

@Controller('/mat')
export class MatController {

  private logger: Logger = new Logger({ name: 'MatController', flags: ['music'] });

  constructor(private music: MusicService, private mat: Mat) {
    music.addInstrument(mat, "Mat");
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
  public play(@Message() message: IOSCMessage) {
    try {
      const buttonIndex = TypeChecker.ValidIndexArg(this.mat.mapping.length, message.args[0]);
      const velocity = TypeChecker.ValidVelocityArg(message.args[1]);

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
   * @apiName Swap two button's notes
   * @apiDesc Swaps the notes that are assigned to the buttons with the provided indices
   * @apiPath /mat/swap
   * @apiArgs i,buttonIndex Expects a button index as integer
   * @apiArgs i,buttonIndex Expects a button index as integer
   */
  @OnMessage('/swap')
  public swap(@Message() message: IOSCMessage) {
    try {
      const first = TypeChecker.ValidIndexArg(this.mat.mapping.length, message.args[0]);
      const second = TypeChecker.ValidIndexArg(this.mat.mapping.length, message.args[1]);

      this.mat.swapMapping(first, second);
      this.logger.info('Trigger', { first, second });
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
        e.printFrontend(this.music.getLogService());
      }
    }
  }
}
