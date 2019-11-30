import * as Tone from 'tone';
import { SampleLibrary } from './sampleLibrary';
import { Logger } from '@upe/logger';
import { NoiseSynth } from 'tone';
import { Gain } from 'tone';
import { Meter } from 'tone';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private instruments: { [k: string]: any } = {};
  private sampleLibrary = new SampleLibrary();

  private gain = new Gain(0.4);

  // meters
  public masterMeter = new Meter(0.9);
  public pianoMeter = new Meter(0.9);
  public kickMeter = new Meter(0.9);
  public snareMeter = new Meter(0.9);
  public hihatMeter = new Meter(0.9);

  private logger: Logger = new Logger({ name: 'Music' });

  constructor() {
    this.instruments.synth = new Tone.Synth();
    this.instruments.drum_kick = this.sampleLibrary.getKickSampler(
      () => this.logger.debug('drum kick buffered'),
    );
    this.instruments.drum_snare = this.sampleLibrary.getSnareSampler(
      () => this.logger.debug('drum snare buffered'),
    );
    this.instruments.piano = this.sampleLibrary.getPianoSampler(
      () => this.logger.debug('piano buffered'),
    );
    this.instruments.hihat = this.sampleLibrary.getHiHatSynth();
    this.instruments.longNote = this.sampleLibrary.getLongNoteSynth();

    // Connect to gain
    this.instruments.synth.connect(this.gain);
    this.instruments.drum_kick.connect(this.gain);
    this.instruments.drum_snare.connect(this.gain);
    this.instruments.piano.connect(this.gain);
    this.instruments.hihat.connect(this.gain);
    this.instruments.longNote.connect(this.gain);

    // Connect to meter
    this.instruments.synth.connect(this.masterMeter);
    this.instruments.drum_kick.connect(this.masterMeter);
    this.instruments.drum_kick.connect(this.kickMeter);
    this.instruments.drum_snare.connect(this.masterMeter);
    this.instruments.drum_snare.connect(this.snareMeter);
    this.instruments.piano.connect(this.masterMeter);
    this.instruments.piano.connect(this.pianoMeter);
    this.instruments.hihat.connect(this.masterMeter);
    this.instruments.hihat.connect(this.hihatMeter);
    this.instruments.longNote.connect(this.masterMeter);

    // Connect to master output
    this.gain.toDestination();

    this.logger.info('Initialized successfully');
  }

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
      case 'hihat':
        const synth = this.instruments.hihat as NoiseSynth;
        synth.triggerAttack();
        break;
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
