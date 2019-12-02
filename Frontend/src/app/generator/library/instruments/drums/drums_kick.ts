import { Velocity, Duration } from '../../types';
import { Sampler } from 'tone';
import { Logger } from '@upe/logger';
import { IMCPInstrument, MCPInstrumentName } from '../../mcp-instrument';

export class DrumsKick implements IMCPInstrument {

  private static readonly baseUrl: string = "assets/samples/";
  private static readonly path = "drums/jazz_kick.wav";

  public name: MCPInstrumentName = 'DrumsKick';

  private logger: Logger = new Logger({ name: 'DrumsKick Instrument', flags: ['music'] });

  private readonly sampler;

  constructor(name?: MCPInstrumentName) {
    this.sampler = new Sampler(
      {C2: DrumsKick.path},
      () => this.logger.info("drum kick buffered"),
      DrumsKick.baseUrl
    );

    if (name) {
      this.name = name;
    }
  }

  public getAudioNode(): Sampler {
    return this.sampler;
  }

  public play(duration: Duration = "8n", velocity: Velocity) {
    this.logger.info(`play kick drum with duration ${duration} and velocity ${velocity}.`);
    this.sampler.triggerAttackRelease("C2", duration, undefined, velocity);
  }

}
