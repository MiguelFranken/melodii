import { Velocity, Duration } from '../types';
import { Sampler } from 'tone';
import { Logger } from '@upe/logger';

export class DrumsSnare {
    private logger: Logger = new Logger({ name: 'DrumsSnare Instrument', flags: ['music'] });

    private static readonly baseUrl: string = "samples/";
    private static readonly path = "drums/jazz_snare.wav";
    public readonly sampler = new Sampler(
      { C2: DrumsSnare.path },
      () => this.logger.debug('drum snare buffered'),
      DrumsSnare.baseUrl
    ).toDestination();

    constructor() {}

    public triggerRelease(duration: Duration = "8n", velocity: Velocity) {
        this.logger.info(`TriggerRelease with duration ${duration} and velocity ${velocity}.`);
        this.sampler.triggerAttackRelease(duration, undefined, velocity)
    }
}
