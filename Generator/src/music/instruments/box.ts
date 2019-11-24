import * as Tone from "tone";
import { Polyphonizer } from '../polyphonizer';

type Note = string;
type Velocity = number;

export class Box {
    private readonly voices = new Polyphonizer(() => new Tone.Synth().toMaster());

    public trigger(note: Note, velocity: Velocity) {
        console.log(`Trigger with note ${note} and velocity ${velocity}.`)
        const voice = this.voices.getVoice(note);
        console.log(voice)
        voice.triggerAttack(note, undefined, velocity);
    }

    public release(note: Note) {
        console.log(`Release with note ${note}.`)
        const voice = this.voices.getVoice(note);
        console.log(voice)
        voice.triggerRelease();
    }
}