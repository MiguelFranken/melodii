import { Polyphonizer } from '../polyphonizer';
import { Note, Velocity, Cents } from '../types';
import { Synth, Frequency } from 'tone';
import { Logger } from '@upe/logger';

export class Box {

  private logger: Logger = new Logger({ name: 'Box Instrument', flags: ['music'] });

  private readonly voices = new Polyphonizer(() => new Synth().toDestination());

  public trigger(note: Note, velocity: Velocity) {
    this.logger.info(`Trigger with note ${note} and velocity ${velocity}.`);
    const voice = this.voices.getVoice(note);
    voice.triggerAttack(note, undefined, velocity);
  }

  public detune(note: Note, cents: Cents) {
    this.logger.info(`Detune with note ${note} and cents ${cents}.`);
    const voice = this.voices.getVoice(note);
    // A Cent is one hundredth semitone. That makes an octave 1200 cents, and an octave is a doubling of frequency.
    const frequency = Frequency(note).toFrequency() * (2 * cents / 1200);
    voice.setNote(frequency);
  }

  public release(note: Note) {
    this.logger.info(`Release with note ${note}.`);
    const voice = this.voices.getVoice(note);
    voice.triggerRelease();
  }

}
