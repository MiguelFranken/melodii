import { Monophonic } from 'tone/build/esm/instrument/Monophonic';
import { Merge, ToneAudioNode } from "tone";

export function isVoiceActive(voice: Monophonic<any>) {
    return voice.getLevelAtTime('+0') > 1e-5; // Taken from `PolySynth._getClosestVoice()`.
}

// convert mono sampler into a sampler with stereo signal
export function convertMonoToStereo(node: ToneAudioNode): ToneAudioNode {
    const merger = new Merge();
    node.connect(merger, 0, 0); // routing the mono signal to the left channel of the merger
    node.connect(merger, 0, 1); // routing the mono signal to the right channel of the merger
    return merger;
}
