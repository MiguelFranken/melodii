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

  @OnMessage()
  public receivedMessage(@Message() msg: IOSCMessage) {
    try {
      const note = TypeChecker.ValidNoteArg(msg.args[0]);
      //TODO add to decorator
      const duration = TypeChecker.ValidDurationArg(msg.args[1]);
      const velocity = TypeChecker.ValidVelocityArg(msg.args[2]);

      this.synth.triggerRelease(note, duration, velocity);
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
        e.printFrontend(this.music.getLogService());
      }
    }
  }

  @OnMessage('/trigger')
  public receivedMessageStart(@Message() msg: IOSCMessage) {
    try {
      const note = TypeChecker.ValidNoteArg(msg.args[0]);
      const velocity = TypeChecker.ValidVelocityArg(msg.args[1]);

      this.synth.trigger(note, velocity);
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
        e.printFrontend(this.music.getLogService());
      }
    }
  }

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

  @OnMessage('/stop')
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
