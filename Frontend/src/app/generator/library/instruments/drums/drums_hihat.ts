import { Velocity, Duration } from '../../types';
import { NoiseSynth } from 'tone';
import { IMCPInstrument, MCPInstrumentName } from '../../mcp-instrument';
import { Logger } from '@upe/logger';

export class DrumsHiHat implements IMCPInstrument {

  private logger: Logger = new Logger({ name: 'DrumsHiHat', flags: ['music'] });

  public name: MCPInstrumentName = "DrumsHiHat";

  private readonly synth = new NoiseSynth({
    noise: {
      type: "white",
    },
    envelope: {
      attack: 0.001,
      decay: 0.3,
      sustain: 0,
      release: 0.3,
    },
  });

  public getAudioNode(): NoiseSynth {
    return this.synth;
  }

  constructor(name?: MCPInstrumentName) {
    if (name) {
      this.name = name;
    }
    this.synth.volume.value = -20;
  }

  public play(duration: Duration = "8n", velocity: Velocity) {
    this.logger.info(`play hihat with duration ${duration} and velocity ${velocity}.`);
    this.synth.triggerAttackRelease(duration, undefined, velocity);
  }

}
