import * as Tone from "tone";

type Note = string;
type Velocity = number;

export class Drums_hihat {
    private readonly url = 'samples/drums/jazz_kick.wav'
    private readonly synth = new Tone.NoiseSynth({
        noise: {
          type: "white",
        },
        envelope: {
          attack: 0.001,
          decay: 0.3,
          sustain: 0,
          release: 0.3
        }
      });

    constructor() {
        this.synth.volume.value = -20;
    }
    public triggerRelease(velocity: Velocity = 1) {
        this.synth.triggerAttackRelease("8n");
    }
}
