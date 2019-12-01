import { Polyphonizer } from '../polyphonizer';
import { Note, Velocity, Duration } from '../types';
import { Synth } from 'tone';

export class PlayNoteSynth {
    private readonly voices = new Polyphonizer(() => new Synth().toDestination());

    public trigger(note: Note, velocity: Velocity) {
        console.log(`Trigger with note${note} and velocity ${velocity}.`);
        const voice = this.voices.getVoice(note);
        voice.triggerAttack(note, undefined, velocity);
    }

    public triggerRelease(note: Note, duration: Duration = "8n", velocity: Velocity = 1){
        console.log(`TriggerRelease with note${note} and velocity ${velocity}.`);
        const voice = this.voices.getVoice(note);
        voice.triggerAttackRelease(note, duration, undefined, velocity);
    }

    public release(note: Note) {
        console.log(`Release with note ${note}.`);
        const voice = this.voices.getVoice(note);
        voice.triggerRelease();
    }
}
