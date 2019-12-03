import { Velocity, Duration } from '../../types';
import { Gain, JCReverb, PingPongDelay, Sampler, ToneAudioNode } from 'tone';
import { Logger } from '@upe/logger';
import { IMCPInstrument, MCPInstrumentName } from '../../mcp-instrument';
import { MCPEffect } from '../../music.service';
import { EffectChain } from '../../effect-chain';

export class DrumsSnare implements IMCPInstrument {

  private static readonly baseUrl: string = "assets/samples/";
  private static readonly path = "drums/jazz_snare.wav";

  public name: MCPInstrumentName = 'DrumsSnare';

  private logger: Logger = new Logger({ name: 'DrumsSnare Instrument', flags: ['music'] });

  private effectChain: EffectChain;

  private outputNode: ToneAudioNode;

  private readonly sampler;

  constructor(name?: MCPInstrumentName) {
    if (name) {
      this.name = name;
    }

    this.outputNode = new Gain(0.4);

    this.sampler = new Sampler(
      { C2: DrumsSnare.path },
      () => this.logger.debug('drum snare buffered'),
      DrumsSnare.baseUrl
    );

    this.effectChain = new EffectChain(this.name, this.sampler);
    this.rewire();
  }

  public getAudioNode() {
    return this.outputNode;
  }

  public play(duration: Duration = "8n", velocity: Velocity) {
    this.logger.info(`play snare with duration ${duration} and velocity ${velocity}`);
    this.sampler.triggerAttackRelease("C2", duration, undefined, velocity);
  }

  public addReverb() {
    this.effectChain.getOutputNode().disconnect(this.outputNode);
    const reverb: MCPEffect = {
      id: 'reverb',
      effect: new JCReverb(0.55)
    };
    this.effectChain.pushEffect(reverb);
    this.rewire();
    this.logger.debug('Added reverb effect');
  }

  public deleteReverb() {
    this.effectChain.getOutputNode().disconnect(this.outputNode);
    this.effectChain.deleteEffectByID('reverb');
    this.rewire();
    this.logger.debug('Deleted reverb effect');
  }

  public addPingPongDelay() {
    this.effectChain.getOutputNode().disconnect(this.outputNode);
    const pingPongDelay: MCPEffect = {
      id: 'pingpongdelay',
      effect: new PingPongDelay('4n', 0.2)
    };
    // pingPongDelay.effect.wet.value = 0.5;
    this.effectChain.pushEffect(pingPongDelay);
    this.rewire();
    this.logger.debug('Added pingpongdelay effect');
  }

  public deletePingPongDelay() {
    this.effectChain.getOutputNode().disconnect(this.outputNode);
    this.effectChain.deleteEffectByID('pingpongdelay');
    this.rewire();
    this.logger.debug('Deleted pingpongdelay effect');
  }

  private rewire() {
    const effectNode = this.effectChain.getOutputNode();
    effectNode.connect(this.outputNode);
  }

}
