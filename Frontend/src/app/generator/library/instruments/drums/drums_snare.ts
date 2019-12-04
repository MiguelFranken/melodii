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

  private effectChain: EffectChain;

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

    this.effectChain = new EffectChain(this.name, merger, this.outputNode);
  }

  public getAudioNode() {
    return this.outputNode;
  }

  public play(duration: Duration = "8n", velocity: Velocity) {
    this.logger.info(`play snare with duration ${duration} and velocity ${velocity}`);
    this.sampler.triggerAttackRelease("C2", duration, undefined, velocity);
  }

  public addReverb() {
    const toneEffect = new Reverb();
    toneEffect.generate();
    const reverb: IMCPEffect = {
      id: 'reverb',
      effect: toneEffect
    };
    reverb.effect.wet.value = 0.5;
    this.effectChain.pushEffect(reverb);
    this.logger.debug('Added reverb effect');
  }

  public deleteReverb() {
    this.effectChain.deleteEffectByID('reverb');
    this.logger.debug('Deleted reverb effect');
  }

  public addPingPongDelay() {
    const pingPongDelay: IMCPEffect = {
      id: 'pingpongdelay',
      effect: new PingPongDelay('4n', 0.2)
    };
    pingPongDelay.effect.wet.value = 0.5;
    this.effectChain.pushEffect(pingPongDelay);
    this.logger.debug('Added pingpongdelay effect');
  }

  public deletePingPongDelay() {
    this.effectChain.deleteEffectByID('pingpongdelay');
    this.logger.debug('Deleted pingpongdelay effect');
  }

}
