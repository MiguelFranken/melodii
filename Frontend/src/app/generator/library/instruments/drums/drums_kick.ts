import { Velocity, Duration } from '../../types';
import { Sampler } from 'tone';
import { Logger } from '@upe/logger';
import { IMCPInstrument, MCPInstrumentName } from '../mcp-instrument';

export class DrumsKick implements IMCPInstrument {

  private static readonly baseUrl: string = "samples/";
  private static readonly path = "drums/jazz_kick.wav";

  public name: MCPInstrumentName = 'DrumsKick';

  private logger: Logger = new Logger({ name: 'DrumsKick Instrument', flags: ['music'] });

  private readonly sampler = new Sampler(
    { C2: DrumsKick.path },
    () => this.logger.debug('drum kick buffered'),
    DrumsKick.baseUrl
  );

  constructor() {}

  public getInstrument(): Sampler {
    return this.sampler;
  }

  public triggerRelease(duration: Duration = "8n", velocity: Velocity) {
    this.logger.info(`TriggerRelease with duration ${duration} and velocity ${velocity}.`);
    this.sampler.triggerAttackRelease(duration, undefined, velocity);
  }

}
