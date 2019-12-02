import { SampleLibrary } from './sample-library';
import { Logger } from '@upe/logger';
import { FeedbackDelay, Gain, JCReverb, PingPongDelay, Reverb } from 'tone';
import { Meter } from 'tone';
import { Injectable } from '@angular/core';
import { DrumsKick } from './instruments/drums/drums_kick';
import { DrumsHiHat } from './instruments/drums/drums_hihat';
import { DrumsSnare } from './instruments/drums/drums_snare';
import { IMCPInstrument } from './mcp-instrument';
import { PlayNoteSynth } from './instruments/playnote_synth';
import { Piano } from './instruments/piano';
import { Effect } from 'tone/build/esm/effect/Effect';
import { StereoEffect } from 'tone/build/esm/effect/StereoEffect';

// unique name of an instrument
export type InstrumentName = string;

// unique name of an meter
export type MeterName = InstrumentName | 'master';

export type MCPEffect = Effect<any> | StereoEffect<any>;

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private static METER_SMOOTHING_FACTOR = 0.9;

  private instruments: Map<InstrumentName, IMCPInstrument> = new Map();

  private meters: Map<MeterName, Meter> = new Map();

  private gain = new Gain(0.4);

  private masterEffectChain: MCPEffect[] = [];

  private logger: Logger = new Logger({ name: 'Music' });

  constructor() {
    this.instruments.set('playnote-synth', new PlayNoteSynth()); // TODO MF: Polyphonizer sollte von Tone's Instrument Klasse erben
    this.instruments.set('kick', new DrumsKick());
    this.instruments.set('snare', new DrumsSnare());
    this.instruments.set('pianoALT', new SampleLibrary()); // TODO MF: Das ist die alte Piano Klasse. Löschen?
    this.instruments.set('piano', new Piano());
    this.instruments.set('hihat', new DrumsHiHat());

    this.addSomeEffectToTheMasterEffectChain();

    this.connectAllInstrumentsToGain();
    this.connectAllInstrumentsToMasterMeter();
    this.createMetersForAllInstruments();
    this.createConnectionsBetweenEffectChain();

    // gain -> master effect chain -> master
    this.gain.connect(this.masterEffectChain[0]);
    this.masterEffectChain[this.masterEffectChain.length - 1].toDestination();

    this.logger.info('Initialized successfully');
  }

  private addSomeEffectToTheMasterEffectChain() {
    this.masterEffectChain.push(new PingPongDelay('4n', 0.2));
    this.masterEffectChain.push(new JCReverb(0.55));
  }

  private createConnectionsBetweenEffectChain() {
    this.masterEffectChain.forEach((effect, index) => {
      if (index + 1 < this.masterEffectChain.length) {
        effect.connect(this.masterEffectChain[index + 1]);
      }
    });
  }

  private connectAllInstrumentsToGain() {
    this.instruments.forEach((instrument: IMCPInstrument) => {
      instrument.getInstrument().connect(this.gain);
    });

    this.logger.info(`Connected all ${this.instruments.size} instruments to gain node`);
  }

  private connectAllInstrumentsToMasterMeter() {
    const meter: Meter = new Meter(MusicService.METER_SMOOTHING_FACTOR);
    this.meters.set('master', meter);
    this.instruments.forEach((instrument: IMCPInstrument) => {
      instrument.getInstrument().connect(meter);
    });

    this.logger.info(`Connected all ${this.instruments.size} instruments to master meter`);
  }

  private createMetersForAllInstruments() {
    this.instruments.forEach((instrument: IMCPInstrument) => {
      const meter: Meter = new Meter(MusicService.METER_SMOOTHING_FACTOR);
      this.meters.set(instrument.name, meter);
      instrument.getInstrument().connect(meter);
    });

    this.logger.info(`Created meters for all ${this.instruments.size} instruments and connected instruments to it`);
  }

  public getMeter(name: MeterName): Meter {
    if (!this.meters.has(name)) {
      this.logger.error('Cannot find meter'); // TODO MF: Errors in eine Klasse packen samt Error.Code und Stack-Trace
    }
    return this.meters.get(name) as Meter;
  }

  public getInstrument(name: InstrumentName): IMCPInstrument {
    if (!this.instruments.has(name)) {
      this.logger.error('Cannot find instrument'); // TODO MF: Errors in eine Klasse packen samt Error.Code und Stack-Trace
    }
    return this.instruments.get(name);
  }

  // Wird im Moment nicht genutzt. So oder ähnlich wird das aber demnächst im Frontend gebraucht
  public getAllInstrumentNames(): InstrumentName[] {
    return Array.from(this.instruments.keys());
  }

}
