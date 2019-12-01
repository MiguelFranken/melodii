import { Velocity, Duration } from '../types';
import { NoiseSynth, Frequency } from 'tone';

export class DrumsHiHat {
    public static readonly synth = new NoiseSynth({
        noise: {
            type: "white",
        },
        envelope: {
            attack: 0.001,
            decay: 0.3,
            sustain: 0,
            release: 0.3,
        },
    }).toDestination();

    constructor() {
        DrumsHiHat.synth.volume.value = -20;
    }

    public trigger(duration: Duration, velocity: Velocity) {
        console.log(`Detune with duration ${duration} and velocity ${velocity}.`);
        DrumsHiHat.synth.triggerAttackRelease(duration, undefined, velocity)
    }
}
