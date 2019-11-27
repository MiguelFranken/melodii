import { NoiseSynth } from 'tone';
import { Velocity } from '../types';

export default class DrumsHihat {
    private readonly url = 'samples/drums/jazz_kick.wav';
    private readonly synth = new NoiseSynth({
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
    public triggerRelease(velocity: Velocity = 1) {
        this.synth.triggerAttackRelease("8n");
    }
}

