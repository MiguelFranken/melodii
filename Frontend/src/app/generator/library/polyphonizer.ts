import { Monophonic } from 'tone/build/esm/instrument/Monophonic';
import { isVoiceActive } from './utils';
import { Logger } from '@upe/logger';

export class Polyphonizer<Voice extends Monophonic<any>> {

    private logger: Logger = new Logger({ name: 'Polyphonizer', flags: ['music'] });

    private voices: Map<string, Voice> = new Map();

    constructor(
        private readonly voiceConstructor: () => Voice,
    ) {
    }

    public getVoice(key: string): Voice {
        const matchingVoice = this.voices.get(key);
        if (matchingVoice) {
            this.logger.info('Found match.');
            return matchingVoice;
        }
        // No voice assigned to this key.

        // Search for idle voice.
        this.voices.forEach((voice: Voice, k: string) => {
            // If this voice is idle, reuse and assign it to the key.
            if (!isVoiceActive(voice)) {
                this.logger.info('Found inactive voice.', voice);
                this.voices.delete(k);
                this.voices.set(key, voice);
                return voice;
            }
        });
        // No idle voice found.

        const newVoice = this.voiceConstructor();
        this.voices.set(key, newVoice);
        this.logger.info('Created new voice.', newVoice);

        return newVoice;
    }

}
