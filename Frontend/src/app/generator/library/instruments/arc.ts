import { Note, Velocity } from '../types';
import { ToneAudioNode, Gain, Synth } from 'tone';
import { Logger } from '@upe/logger';
import { IMCPInstrument, MCPInstrumentName } from '../mcp-instrument';
import { convertMonoToStereo } from "../utils";

export class Arc implements IMCPInstrument {

  private readonly voices: Map<string, Synth> = new Map();
  private readonly output = new Gain();

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
    return new Synth({
      portamento: 0,
      envelope: {
        attack: 0.01,
        attackCurve: "exponential",
        decay: 2,
        decayCurve: "exponential",
        sustain: 1,
        release: 2.7,
        releaseCurve: "exponential",
      },
      oscillator: {
        type: "pulse" as any,
      }
    }).connect(this.output);
  }

  getAudioNode(): ToneAudioNode {
    return convertMonoToStereo(this.output);
  }

}
