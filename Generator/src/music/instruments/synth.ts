import * as Tone from "tone";

type Note = string;
type Velocity = number;

export class Synth {
    private readonly synth = new Tone.Synth();
    
    public trigger(note: Note, velocity: Velocity) {
        this.synth.triggerAttack(note, undefined, velocity);
    }

    public release(note: Note) {
        this.synth.triggerRelease(note);
    }

    public triggerRelease(note: Note, velocity: Velocity) {
        console.log(`Play sound ${note}, ${velocity}.`);
        this.synth.triggerAttackRelease(note, 0.01, undefined, velocity);
    }
}
