import { Note, Velocity, Cents } from '../types';
import { Synth, Frequency, Merge } from 'tone';
import { Logger } from '@upe/logger';
import { IMCPInstrument, MCPInstrumentName } from '../mcp-instrument';
import { DefaultMap } from '../defaultMap';

export class Box implements IMCPInstrument {

  private readonly voices = new DefaultMap(this.createVoice);
  private readonly output = new Merge();

  private readonly logger: Logger = new Logger({ name: 'Box Instrument', flags: ['music'] });

  constructor(public readonly name: MCPInstrumentName = "Box") {
  }

  public trigger(note: Note, velocity: Velocity) {
    this.logger.info(`Trigger with note ${note} and velocity ${velocity}.`);
    const voice = this.voices.get(note);
    voice.triggerAttack(note, undefined, velocity);
  }

  public detune(note: Note, cents: Cents) {
    this.logger.info(`Detune with note ${note} and cents ${cents}.`);
    const voice = this.voices.get(note);
    // A Cent is one hundredth semitone. That makes an octave 1200 cents, and an octave is a doubling of frequency.
    const frequency = Frequency(note).toFrequency() * (2 * cents / 1200);
    voice.setNote(frequency);
  }

  public release(note: Note) {
    this.logger.info(`Release with note ${note}.`);
    const voice = this.voices.get(note);
    voice.triggerRelease();
  }

  private createVoice(): Synth {
    return new Synth().connect(this.output);
  }

  public getAudioNode() {
    return this.output;
  }
}
