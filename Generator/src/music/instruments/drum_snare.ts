import * as Tone from "tone";

type Note = string;
type Velocity = number;

export class Drums_snare {
    private readonly url = 'samples/drums/jazz_snare.wav';
    private readonly sampler = new Tone.Sampler({ C2: this.url },); 
    private readonly mappedNote = "C2";   

    public triggerRelease(velocity: Velocity = 1) {
        this.sampler.triggerAttackRelease(
            this.mappedNote, 0.01, undefined, velocity
        );
    }
}
