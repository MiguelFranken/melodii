import { Controller, Message, OnMessage } from '../decorator/decorators';
import { IOSCMessage } from '../osc/osc-message';
import { Arc } from '../instruments/arc';
import { Logger } from '@upe/logger';
import { MusicService } from '../music.service';
import { TypeChecker } from '../type-checker';
import { OSCError } from '../error';

@Controller('/arc')
export class ArcController {

  private logger: Logger = new Logger({ name: 'ArcController', flags: ['music'] });

  private arc: Arc;

  constructor(private music: MusicService) {
    this.arc = music.getInstrument("arc") as Arc;
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

      this.arc.set(note, strength);
      this.logger.info('Set', { note, strength });
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
        e.printFrontend(this.music.getLogService());
      }
    }
  }

}
