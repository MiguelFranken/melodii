import { Velocity, Duration } from '../../types';
import { Sampler } from 'tone';
import { Logger } from '@upe/logger';
import { IMCPInstrument, MCPInstrumentName } from '../../mcp-instrument';

export class DrumsSnare implements IMCPInstrument {

  private static readonly baseUrl: string = "samples/";
  private static readonly path = "drums/jazz_snare.wav";

  public name: MCPInstrumentName = 'DrumsSnare';

  private logger: Logger = new Logger({ name: 'DrumsSnare Instrument', flags: ['music'] });

  constructor(name?: MCPInstrumentName) {
    if (name) {
      this.name = name;
    }
  }

  private readonly sampler = new Sampler(
    { C2: DrumsSnare.path },
    () => this.logger.debug('drum snare buffered'),
    DrumsSnare.baseUrl
  );

  public getInstrument() {
    return this.sampler;
  }

  public triggerAttack(velocity: Velocity) {
    this.logger.info(`Trigger with velocity ${velocity}`);
    this.sampler.triggerAttack('C2');
  }

  public triggerRelease(duration: Duration = "8n", velocity: Velocity) {
    this.logger.info(`TriggerRelease with duration ${duration} and velocity ${velocity}`);
    this.sampler.triggerAttackRelease("C2", duration, velocity);
  }

}
