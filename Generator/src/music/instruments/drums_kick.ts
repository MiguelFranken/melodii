import { Sampler } from 'tone';
import { Velocity } from '../types';

export default class DrumsKick {
    private readonly url = 'samples/drums/jazz_kick.wav';
    private readonly sampler = new Sampler(
        { C2: this.url },
        () => console.log("drum kick bufferd"), // just for debug purpose
    ).toDestination();
    private readonly mappedNote = "C2";

    public triggerRelease(velocity: Velocity = 1) {
        this.sampler.triggerAttackRelease(
            this.mappedNote, 0.01, undefined, velocity,
        );
    }
}
