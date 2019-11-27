import { Sampler } from 'tone';
import { Velocity, Note } from '../types';

export default class DrumsSnare {
    private readonly url = 'samples/drums/jazz_snare.wav';
    private readonly sampler = new Sampler(
        { C2: this.url },
        () => console.log("drum snare bufferd"), // just for debug purpose
    ).toDestination();
    private readonly mappedNote = "C2";

    public triggerRelease(velocity: Velocity = 1) {
        this.sampler.triggerAttackRelease(
            this.mappedNote, 0.01, undefined, velocity,
        );
    }
}
