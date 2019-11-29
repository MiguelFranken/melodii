import * as Tone from 'tone';
import { SampleLib } from './samplelib';
import { Logger } from '@upe/logger';

export class Music {

  private logger: Logger = new Logger({ name: 'Music' });

  constructor() {
    this.instruments.synth = new Tone.Synth().toDestination();
    this.instruments.drum_kick = this.sampleLib.getKickSampler(
      () => this.logger.info('drum kick buffered'), // just for debug purpose
    ).toDestination();
    this.instruments.drum_snare = this.sampleLib.getSnareSampler(
      () => this.logger.info('drum snare buffered'), // just for debug purpose
    ).toDestination();
    this.instruments.piano = this.sampleLib.getPianoSampler(
      () => this.logger.info('piano buffered'), // just for debug purpose
    ).toDestination();
    this.instruments.hihat = this.sampleLib.getHiHatSynth().toDestination();
    this.instruments.longNote = this.sampleLib.getLongNoteSynth().toDestination();
  }

  private instruments: { [k: string]: any } = {};
  private sampleLib = new SampleLib();

  /**
   * Plays a single note
   * @param note "C4", "D2", "A2", ...
   * @param velocity Between 0 and 1
   * @param volume TODO
   */
  public playNote(note: string, velocity: number, volume: number): void {
    this.logger.info(`Play sound ${note}, ${velocity}, ${volume}.`);
    const { synth } = this.instruments;
    synth.volume.value = volume;
    synth.triggerAttackRelease(note, velocity);
  }

  /**
   * Plays a single note on piano sampler
   * @param note "C4", "D2", "A2", ...
   */
  public pianoPlayNote(note: string): void {
    this.logger.info(`Play sound ${note}.`);
    this.instruments.piano.triggerAttackRelease(note, '8n');
  }

  /**
   * plays the drums
   * @param instrument which part of the drums should be played
   */
  public playDrums(instrument: string): void {
    switch (instrument) {
      case 'kick': this.instruments.drum_kick.triggerAttack('C2'); break;
      case 'snare': this.instruments.drum_snare.triggerAttack('C2'); break;
      case 'hihat': this.instruments.hihat.triggerAttackRelease('8n'); break;
    }
  }

  /**
   * Starts the attack of a single note
   * @param note "C4", "D2", "A2", ...
   */
  public startLongNote(note: string, volume: number): void {
    const { longNote } = this.instruments;
    longNote.volume.value = volume;
    longNote.triggerAttack(note);
  }

  /**
   * Releases the holded single note
   * @param note "C4", "D2", "A2", ...
   */
  public stopLongNote(): void {
    this.instruments.longNote.triggerRelease();
  }

}
