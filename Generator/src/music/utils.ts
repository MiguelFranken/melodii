import { Monophonic } from 'tone/build/esm/instrument/Monophonic';

export function isVoiceActive(voice: Monophonic<any>) {
    return voice.getLevelAtTime("+0") > 1e-5; // Taken from `PolySynth._getClosestVoice()`.
}