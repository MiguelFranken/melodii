import { Velocity, Duration } from '../../types';
import { Gain, Merge, PingPongDelay, Reverb, Sampler, ToneAudioNode } from 'tone';
import { Logger } from '@upe/logger';
import { IMCPInstrument, MCPInstrumentName } from '../../mcp-instrument';
import { IMCPEffect } from '../../types';
import { EffectChain } from '../../effect-chain';

export class DrumsSnare implements IMCPInstrument {

  private static readonly baseUrl: string = "assets/samples/";
  private static readonly path = "drums/jazz_snare.wav";

  public name: MCPInstrumentName = 'DrumsSnare';

  private logger: Logger = new Logger({ name: 'DrumsSnare Instrument', flags: ['music'] });

  private readonly outputNode: ToneAudioNode;

  private readonly sampler: Sampler;

  constructor(name?: MCPInstrumentName) {
    if (name) {
      this.name = name;
    }

    // mono sampler -> stereo sampler -> effect chain -> gain
    this.outputNode = new Gain();

    this.sampler = new Sampler(
      { C2: DrumsSnare.path },
      () => this.logger.debug('drum snare buffered'),
      DrumsSnare.baseUrl
    );

    // convert mono sampler into a sampler with stereo signal
    const merger = new Merge();
    this.sampler.connect(merger, 0, 0); // routing the mono signal to the left channel of the merger
    this.sampler.connect(merger, 0, 1); // routing the mono signal to the right channel of the merger

    merger.connect(this.outputNode);
  }

  public getAudioNode() {
    return this.outputNode;
  }

  public play(duration: Duration = "8n", velocity: Velocity) {
    this.logger.info(`play snare with duration ${duration} and velocity ${velocity}`);
    this.sampler.triggerAttackRelease("C2", duration, undefined, velocity);
  }

}
