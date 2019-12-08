import { Note, Velocity } from '../types';
import { isVoiceActive } from '../utils';
import { Synth, ToneAudioNode, Merge } from 'tone';
import { Logger } from '@upe/logger';
import { IMCPInstrument, MCPInstrumentName } from '../mcp-instrument';
import { DefaultMap } from '../defaultMap';

export class Arc implements IMCPInstrument {
  private readonly voices: Map<string, Synth> = new Map();
  private readonly output = new Merge();

  private readonly logger: Logger = new Logger({ name: 'Arc Instrument', flags: ['music'] });

  constructor(public readonly name: MCPInstrumentName = "Arc") {
  }

  public set(note: Note, strength: Velocity) {
    this.logger.info(`Set with note ${note} and velocity ${strength}.`);
    const voice = this.voices.get(note);
    const volume = -40 + strength * 40; // In db.
    if (voice) {
      if (strength > 0) {
        voice.volume.linearRampToValueAtTime(volume, "+0.1");
      } else {
        voice.triggerRelease();
        this.voices.delete(note);
      }
    } else { // Key not found in this.voices.
      if (strength > 0) {
        const voice = this.createVoice();
        this.voices.set(note, voice);
        voice.volume.value = volume;
        voice.triggerAttack(note, undefined, 1);
      }
    }
  }

  private createVoice(): Synth {
    return new Synth().connect(this.output);
  }

  getAudioNode(): ToneAudioNode {
    return this.output;
  }
}
