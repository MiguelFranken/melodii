import * as Tone from "tone";
import { Polyphonizer } from '../polyphonizer';
import { Note, Velocity, Cents } from '../types';

export class Arc {
    private readonly voices = new Polyphonizer(() => new Tone.Synth({ envelope: { attack: 0 } }).toMaster());

    public set(note: Note, strength: Velocity) {
        console.log(`Trigger with note ${note} and velocity ${strength}.`);
        const voice = this.voices.getVoice(note);
        if (strength > 0) {
            voice.triggerAttack(note, undefined, strength);
        } else {
            voice.triggerRelease();
        }
    }
}