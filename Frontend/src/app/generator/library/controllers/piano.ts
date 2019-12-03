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

  @OnMessage('/play_note')
  public receivedMessage(@Message() message: IOSCMessage) {
    try {
      const note = message.args[0].value.toString();
      const velocity = parseFloat(message.args[1].value.toString());
      // TODO add position to decorators
      const duration = message.args[2]? TypeChecker.ValidDurationArg(message.args[2]): undefined;
      
      this.piano.play(note, duration, velocity);
      this.logger.info('play_note', {note, duration, velocity});
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
      }
    }

  }

}
