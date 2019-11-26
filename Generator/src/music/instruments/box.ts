import { Polyphonizer } from '../polyphonizer';
import { Note, Velocity, Cents } from '../types';
import { Synth, Frequency } from 'tone';

export class Box {
    private readonly voices = new Polyphonizer(() => new Synth().toDestination());

    public trigger(note: Note, velocity: Velocity) {
        console.log(`Trigger with note ${note} and velocity ${velocity}.`);
        const voice = this.voices.getVoice(note);
        voice.triggerAttack(note, undefined, velocity);
    }

    public detune(note: Note, cents: Cents) {
        console.log(`Detune with note ${note} and cents ${cents}.`);
        const voice = this.voices.getVoice(note);
        voice.setNote(Frequency("C4").toFrequency() + cents);
    }

    public release(note: Note) {
        console.log(`Release with note ${note}.`);
        const voice = this.voices.getVoice(note);
        voice.triggerRelease();
    }
}