import { Controller, Message, OnMessage } from '../decorator/decorators';
import { IOSCMessage } from '../osc/osc-message';
import { MusicService } from '../music.service';
import { Piano } from '../instruments/piano';
import { TypeChecker } from '../type-checker';
import { OSCError } from '../error';
import { Logger } from '@upe/logger';

@Controller('/piano')
export class PianoController {

  private logger: Logger = new Logger({ name: 'PianoController', flags: ['music'] });

  private piano: Piano;

  constructor(private music: MusicService) {
    this.piano = music.getInstrument('piano') as Piano;
  }

  /**
   * @apiGroup Piano
   * @apiName Play Note
   * @apiDesc Plays a note from the piano sampler
   * @apiPath /piano/play_note
   * @apiArgs s,note Expects a note as string
   * @apiArgs s,duration Expects the duration of the note as string
   * @apiArgs f,velocity Expects the velocity [0,1] of the note as float
   */
  @OnMessage('/play_note')
  public receivedMessage(@Message() message: IOSCMessage) {
    try {
      // TODO add position to decorators
      const note = TypeChecker.ValidNoteArg(message.args[0]);
      const duration = TypeChecker.ValidDurationArg(message.args[1]);
      const velocity = TypeChecker.ValidVelocityArg(message.args[2]);

      this.piano.play(note, duration, velocity);
      this.logger.info('play_note', { note, duration, velocity });
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
      }
    }
  }

}
