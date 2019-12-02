import { Velocity, Duration } from '../../types';
import { NoiseSynth, Frequency } from 'tone';

export class DrumsHiHat {

    public readonly synth = new NoiseSynth({
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
        this.synth.volume.value = -20;
    }

    public triggerRelease(duration: Duration = "8n", velocity: Velocity) {
        console.log(`Detune with duration ${duration} and velocity ${velocity}.`);
        this.synth.triggerAttackRelease(duration, undefined, velocity);
    }

}
