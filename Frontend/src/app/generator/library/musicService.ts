import * as Tone from 'tone';
import { SampleLib } from './samplelib';
import { Logger } from '@upe/logger';
import { interval } from 'rxjs';
import { Volume } from 'tone';
import { Gain } from 'tone';
import { Meter } from 'tone';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  static GAIN = new Gain(0.4);
  static MASTER_METER = new Meter(0.9);
  static PIANO_METER = new Meter(0.9);
  static KICK_METER = new Meter(0.9);
  static SNARE_METER = new Meter(0.9);
  static HIHAT_METER = new Meter(0.9);

  private logger: Logger = new Logger({ name: 'Music' });

  constructor() {
    this.instruments.synth = new Tone.Synth();
    this.instruments.drum_kick = this.sampleLib.getKickSampler(
      () => this.logger.debug('drum kick buffered'),
    );
    this.instruments.drum_snare = this.sampleLib.getSnareSampler(
      () => this.logger.debug('drum snare buffered'),
    );
    this.instruments.piano = this.sampleLib.getPianoSampler(
      () => this.logger.debug('piano buffered'),
    );
    this.instruments.hihat = this.sampleLib.getHiHatSynth();
    this.instruments.longNote = this.sampleLib.getLongNoteSynth();

    this.instruments.synth.connect(MusicService.GAIN);
    this.instruments.drum_kick.connect(MusicService.GAIN);
    this.instruments.drum_snare.connect(MusicService.GAIN);
    this.instruments.piano.connect(MusicService.GAIN);
    this.instruments.hihat.connect(MusicService.GAIN);
    this.instruments.longNote.connect(MusicService.GAIN);

    this.instruments.synth.connect(MusicService.MASTER_METER);
    this.instruments.drum_kick.connect(MusicService.MASTER_METER);
    this.instruments.drum_kick.connect(MusicService.KICK_METER);
    this.instruments.drum_snare.connect(MusicService.MASTER_METER);
    this.instruments.drum_snare.connect(MusicService.SNARE_METER);
    this.instruments.piano.connect(MusicService.MASTER_METER);
    this.instruments.piano.connect(MusicService.PIANO_METER);
    this.instruments.hihat.connect(MusicService.MASTER_METER);
    this.instruments.hihat.connect(MusicService.HIHAT_METER);
    this.instruments.longNote.connect(MusicService.MASTER_METER);

    // Connect to master output
    MusicService.GAIN.toDestination();

    this.logger.info('Initialized successfully');
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
      case 'hihat':
        this.instruments.hihat.triggerAttackRelease('8n');

        break; // 64n als workaround fix
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
