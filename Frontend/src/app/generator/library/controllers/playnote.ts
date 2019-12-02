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
      const note = TypeChecker.ValidNote(msg.args);
      const duration = TypeChecker.ValidDuration(msg.args);
      const velocity = TypeChecker.ValidVelocity(msg.args);

      this.synth.triggerRelease(note, duration, velocity);
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
      }
    }
  }

  @OnMessage('/trigger')
  public receivedMessageStart(@Message() msg: IOSCMessage) {
    try {
      const note = TypeChecker.ValidNote(msg.args);
      const velocity = TypeChecker.ValidVelocity(msg.args);

      this.synth.trigger(note, velocity);
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
      }
    }
  }

  @OnMessage('/detune')
  public detune(@Message() msg: IOSCMessage) {
    try {
      const note = TypeChecker.ValidNote(msg.args);
      const cents = TypeChecker.ValidCents(msg.args);

      this.synth.detune(note, cents);
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
      }
    }
  }

  @OnMessage('/stop')
  public receivedMessageStop(@Message() msg: IOSCMessage) {
    try {
      const note = TypeChecker.ValidNote(msg.args);

      this.synth.release(note);
    } catch (e) {
      if (e instanceof OSCError) {
        e.print(this.logger);
      }
    }
  }

}
