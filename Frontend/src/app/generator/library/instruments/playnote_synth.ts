import { Note, Velocity, Duration, Cents } from '../types';
import { Synth, Frequency, Merge } from 'tone';
import { Logger } from '@upe/logger';
import { IMCPInstrument, MCPInstrumentName } from '../mcp-instrument';
import { InstrumentName } from '../types';
import { DefaultMap } from '../defaultMap';

export class PlayNoteSynth implements IMCPInstrument {
  private readonly voices = new DefaultMap(this.createVoice);
  private readonly output = new Merge();

  private logger: Logger = new Logger({ name: 'PlayNoteSynth Instrument', flags: ['music'] });

  constructor(public readonly name: MCPInstrumentName = 'playnote-synth') {
  }

  public trigger(note: Note, velocity: Velocity) {
    console.log(`Trigger with note${note} and velocity ${velocity}.`);
    const voice = this.voices.get(note);
    voice.triggerAttack(note, undefined, velocity);
  }

  public triggerRelease(note: Note, duration: Duration, velocity: Velocity) {
    this.logger.info(`TriggerRelease with note ${note} and velocity ${velocity}.`);
    const voice = this.voices.get(note);
    voice.triggerAttackRelease(note, duration, undefined, velocity);
  }

  public detune(note: Note, cents: Cents) {
    this.logger.info(`Detune with note ${note} and cents ${cents}.`);
    const voice = this.voices.get(note);

    // A Cent is one hundredth semitone. That makes an octave 1200 cents,
    // and an octave is a doubling of frequency.
    const frequency = Frequency(note).toFrequency() * (2 * cents / 1200);
    voice.setNote(frequency);
  }

  public release(note: Note) {
    console.log(`Release with note ${note}.`);
    const voice = this.voices.get(note);
    voice.triggerRelease();
  }

  public getAudioNode() {
    return this.output;
  }

  private createVoice(): Synth {
    return new Synth().connect(this.output);
  }

}
