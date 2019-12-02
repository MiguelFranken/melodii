import { Polyphonizer } from '../polyphonizer';
import { Note, Velocity } from '../types';
import { isVoiceActive } from '../utils';
import { Synth } from 'tone';
import { Logger } from '@upe/logger';

export class Arc {

  private logger: Logger = new Logger({ name: 'Arc Instrument', flags: ['music'] });

  private readonly voices = new Polyphonizer(() => new Synth().toDestination());

  public set(note: Note, strength: Velocity) {
    this.logger.info(`Set with note ${note} and velocity ${strength}.`);
    const voice = this.voices.getVoice(note);
    const volume = -40 + strength * 40; // In db.
    if (strength > 0) {
      voice.volume.linearRampToValueAtTime(volume, "+0.1");

      if (!isVoiceActive(voice)) {
        voice.triggerAttack(note, undefined, 1);
      }
    } else {
      voice.volume.value = 0; // Reset volume for next use.
      voice.triggerRelease();
    }
  }

}
