import { Controller, Message, OnMessage } from "../decorator/decorators";
import { IOSCMessage } from "../osc/osc-message";
import { MusicService } from '../music.service';
import { PlayNoteSynth } from '../instruments/playnote_synth';
import { TypeChecker, OSCError } from '../types';
import { Type } from '@angular/compiler';

@Controller('/play_note')
export class PlayNoteController {
  private synth: PlayNoteSynth;

  constructor(private music: MusicService) {
    this.synth = music.instruments.playNoteSynth;
  }

  @OnMessage()
  public receivedMessage(@Message() msg: IOSCMessage) {
    try {
      const note = TypeChecker.validNote(msg.args);
      const duration = TypeChecker.validDuration(msg.args);
      const velocity = TypeChecker.validVelocity(msg.args);

      this.synth.triggerRelease(note, duration, velocity);
    } catch (e) {
      if (e instanceof OSCError) {
        e.print();
      }
    }
  }

  @OnMessage('/trigger')
  public receivedMessageStart(@Message() msg: IOSCMessage) {
    try {
      const note = TypeChecker.validNote(msg.args);
      const velocity = TypeChecker.validVelocity(msg.args);

      this.synth.trigger(note, velocity);
    } catch (e) {
      if (e instanceof OSCError) {
        e.print();
      }
    }
  }

  @OnMessage('/detune')
  public detune(@Message() msg: IOSCMessage) {
    try {
      const note = TypeChecker.validNote(msg.args);
      const cents = TypeChecker.validCents(msg.args);

      this.synth.detune(note, cents);
    } catch (e) {
      if (e instanceof OSCError) {
        e.print();
      }
    }
  }

  

  @OnMessage('/stop')
  public receivedMessageStop(@Message() msg: IOSCMessage) {
    try {
      const note = TypeChecker.validNote(msg.args);

      this.synth.release(note);
    } catch (e) {
      if (e instanceof OSCError) {
        e.print();
      }
    }
  }
}
