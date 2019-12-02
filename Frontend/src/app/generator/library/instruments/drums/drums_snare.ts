import { Velocity, Duration } from '../../types';
import { JCReverb, Sampler, ToneAudioNode } from 'tone';
import { Logger } from '@upe/logger';
import { IMCPInstrument, MCPInstrumentName } from '../../mcp-instrument';
import { MCPEffect } from '../../music.service';

export class DrumsSnare implements IMCPInstrument {

  private static readonly baseUrl: string = "assets/samples/";
  private static readonly path = "drums/jazz_snare.wav";

  public name: MCPInstrumentName = 'DrumsSnare';

  private logger: Logger = new Logger({ name: 'DrumsSnare Instrument', flags: ['music'] });

  private effectChain: MCPEffect[] = [];

  private outputAudioNode: ToneAudioNode;

  constructor(name?: MCPInstrumentName) {
    if (name) {
      this.name = name;
    }

    this.addReverb();
    this.wireEffects();
  }

  private readonly sampler = new Sampler(
    { C2: DrumsSnare.path },
    () => this.logger.debug('drum snare buffered'),
    DrumsSnare.baseUrl
  );

  public getAudioNode() {
    return this.outputAudioNode;
  }

  public play(duration: Duration = "8n", velocity: Velocity) {
    this.logger.info(`play snare with duration ${duration} and velocity ${velocity}`);
    this.sampler.triggerAttackRelease("C2", duration, undefined, velocity);
  }

  public addReverb() {
    const reverb: MCPEffect = {
      id: 'reverb',
      effect: new JCReverb(0.55)
    };
    this.effectChain.push(reverb);
    this.logger.debug('Added reverb effect. Effect chain:', this.effectChain);
  }

  private wireEffects() {
    if (this.effectChain.length === 0) {
      this.outputAudioNode = this.sampler;
    } else {
      // TODO
      this.sampler.connect(this.effectChain[0].effect);
      this.outputAudioNode = this.effectChain[0].effect;
    }

    this.logger.debug('Wired effects. OutputAudioNode:', this.outputAudioNode);
  }

}
