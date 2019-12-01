import { Velocity, Duration } from '../types';
import { Sampler } from 'tone';
import { Logger } from '@upe/logger';

export class DrumsKick {
    private logger: Logger = new Logger({ name: 'DrumsKick Instrument', flags: ['music'] });

    private static readonly baseUrl: string = "samples/";
    private static readonly path = "drums/jazz_kick.wav";
    public readonly sampler = new Sampler(
      { C2: DrumsKick.path },
      () => this.logger.debug('drum kick buffered'),
      DrumsKick.baseUrl
    ).toDestination();

    constructor() {}

    public triggerRelease(duration: Duration = "8n", velocity: Velocity) {
        this.logger.info(`TriggerRelease with duration ${duration} and velocity ${velocity}.`);
        this.sampler.triggerAttackRelease(duration, undefined, velocity)
    }
}
