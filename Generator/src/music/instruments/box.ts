import * as Tone from "tone";

type Note = string;
type Velocity = number;

export class Box {
    private readonly synth = new Tone.PolySynth(64, Tone.Synth).toMaster();

    public trigger(note: Note, velocity: Velocity) {
        console.log(`Trigger with note ${note} and velocity ${velocity}.`)
        this.synth.triggerAttack(note, undefined, velocity);
    }

    public release(note: Note) {
        console.log(`Release with note ${note}.`)
        this.synth.triggerRelease(note);
    }
}