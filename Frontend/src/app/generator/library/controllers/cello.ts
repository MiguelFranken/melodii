import { Controller, Message, OnMessage } from '../decorator/decorators';
import { IOSCMessage } from '../osc/osc-message';
import { Logger } from '@upe/logger';
import { MusicService } from '../music.service';
import { TypeChecker } from '../type-checker';
import { OSCError } from '../error';
import { Cello } from "../instruments/cello";

@Controller('/cello')
export class CelloController {

  private logger: Logger = new Logger({ name: 'CelloController', flags: ['music'] });

  private cello: Cello;

  constructor(private music: MusicService) {
    this.cello = music.getInstrument("cello") as Cello;
  }

  /**
   * @apiGroup Cello
   * @apiName Set
   * @apiDesc Sets the volume of the note
   * @apiPath /cello/set
   * @apiArgs s,note Expects a note as string
   * @apiArgs f,velocity Expects the strength in [0, 1] of the note as a float
   */
  @OnMessage('/set')
  public trigger(@Message() message: IOSCMessage) {
    try {
      const { args } = message;
      const note = TypeChecker.ValidNoteArg(args[0]);
      const velocity: any = args[1].value; // TODO: Validate velocity

      this.cello.set(note, velocity);
      this.logger.info('Set', { note, velocity });
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
        e.printFrontend(this.music.getLogService());
      }
    }
  }

}
