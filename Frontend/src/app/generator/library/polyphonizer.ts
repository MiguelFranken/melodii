import { Monophonic } from 'tone/build/esm/instrument/Monophonic';
import { isVoiceActive } from './utils';

export class Polyphonizer<Voice extends Monophonic<any>> {
    private voices: Map<string, Voice> = new Map();

    constructor(
        private readonly voiceConstructor: () => Voice,
    ) {
    }

    public getVoice(key: string): Voice {
        const matchingVoice = this.voices.get(key);
        if (matchingVoice) {
            console.log('Found match.');
            return matchingVoice;
        }
        // No voice assigned to this key.

        // Search for idle voice.
        for (const [k, voice] of this.voices) {

            // If this voice is idle, reuse and assign it to the key.
            if (!isVoiceActive(voice)) {
                console.log('Found inactive voice.');
                this.voices.delete(k);
                this.voices.set(key, voice);
                return voice;
            }
        }
        // No idle voice found.

        console.log('Created new voice.');
        const newVoice = this.voiceConstructor();
        this.voices.set(key, newVoice);
        return newVoice;
    }
}
