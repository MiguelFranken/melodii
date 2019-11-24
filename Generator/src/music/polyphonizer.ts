type Voice = any;

export class Polyphonizer {
    private voices: Map<string, Voice> = new Map();

    constructor(
        private readonly voiceConstructor: () => Voice
    ) {
    }

    public getVoice(key: string): Voice {
        const matchingVoice = this.voices.get(key);
        if (matchingVoice) {
            console.log("Found match.")
            return matchingVoice;
        }
        // No voice assigned to this key.

        // Search for idle voice.
        for (let k in this.voices.entries()) {
            const voice = this.voices.get(k);
            const isActive = voice.getLevelAtTime("+0") > 1e-5; // Taken from `PolySynth._getClosestVoice()`.

            // If this voice is idle, reuse and assign it to the key.
            if (!isActive) {
                console.log("Found inactive voice.")
                this.voices.delete(k);
                this.voices.set(key, voice);
                return voice;
            }
        }
        // No idle voice found.

        console.log("Created new voice.")
        const newVoice = this.voiceConstructor();
        this.voices.set(key, newVoice);
        return newVoice;
    }
}