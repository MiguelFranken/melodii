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

  @OnMessage('/trigger')
  public trigger(@Message() message: IOSCMessage) {
    try {
      const note = TypeChecker.ValidNoteArg(message.args[0]);
      const velocity = TypeChecker.ValidVelocityArg(message.args[1]);

      this.box.trigger(note, velocity);
      this.logger.info('Trigger', { note, velocity });
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
        e.printFrontend(this.music.getLogService());
      }
    }
  }

  @OnMessage('/detune')
  public detune(@Message() message: IOSCMessage) {
    try {
      const note = TypeChecker.ValidNoteArg(message.args[0]);
      const cents = TypeChecker.ValidCentsArg(message.args[1]);

      this.box.detune(note, cents);
      this.logger.info('Detune', {note, cents});
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
        e.printFrontend(this.music.getLogService());
      }
    }
  }

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
}
