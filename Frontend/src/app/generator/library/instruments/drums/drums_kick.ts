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

  public getInstrument(): Sampler {
    return this.sampler;
  }

  public play(velocity: Velocity) {
    this.logger.info(`Playing kick drum with velocity ${velocity}.`);
    this.sampler.triggerAttack('C2');
  }

  public triggerRelease(duration: Duration = "8n", velocity: Velocity) {
    this.logger.info(`TriggerRelease with duration ${duration} and velocity ${velocity}.`);
    // this.sampler.triggerAttackRelease("C2", duration, velocity);
  }

}
