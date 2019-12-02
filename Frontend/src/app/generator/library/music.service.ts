import * as Tone from 'tone';
import { SampleLibrary } from './sampleLibrary';
import { Logger } from '@upe/logger';
import { NoiseSynth } from 'tone';
import { Gain } from 'tone';
import { Meter } from 'tone';
import { Injectable } from '@angular/core';
import { PlayNoteSynth } from './instruments/playnote_synth';
import { DrumsKick } from './instruments/drums/drums_kick';
import { DrumsHiHat } from './instruments/drums/drums_hihat';
import { DrumsSnare } from './instruments/drums/drums_snare';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  public instruments: { [k: string]: any } = {};
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
    this.instruments.synth = new PlayNoteSynth();
    this.instruments.kick = new DrumsKick();
    this.instruments.snare = new DrumsSnare();
    this.instruments.piano = this.sampleLibrary.getPianoSampler(
      () => this.logger.debug('piano buffered'),
    );
    this.instruments.hihat = new DrumsHiHat();

    // Connect to gain
    this.instruments.synth.connect(this.gain);
    this.instruments.drum_kick.connect(this.gain);
    this.instruments.drum_snare.connect(this.gain);
    this.instruments.piano.connect(this.gain);
    this.instruments.hihat.connect(this.gain);

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

    // Connect to master output
    this.gain.toDestination();

    this.logger.info('Initialized successfully');
  }

}
