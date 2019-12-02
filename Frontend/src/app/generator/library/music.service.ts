import { SampleLibrary } from './sample-library';
import { Logger } from '@upe/logger';
import { Gain } from 'tone';
import { Meter } from 'tone';
import { Injectable } from '@angular/core';
import { DrumsKick } from './instruments/drums/drums_kick';
import { DrumsHiHat } from './instruments/drums/drums_hihat';
import { DrumsSnare } from './instruments/drums/drums_snare';
import { IMCPInstrument } from './mcp-instrument';
import { PlayNoteSynth } from './instruments/playnote_synth';

// unique name of an instrument
export type InstrumentName = string;

// unique name of an meter
export type MeterName = InstrumentName | 'master';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private static METER_SMOOTHING_FACTOR = 0.9;

  private instruments: Map<InstrumentName, IMCPInstrument> = new Map();
  // private instruments: Map<string, Instrument<any> | Polyphonizer<any>> = new Map(); // TODO MF: Polyphonizer should be an instrument!

  private meters: Map<MeterName, Meter> = new Map();

  private gain = new Gain(0.4);

  private logger: Logger = new Logger({ name: 'Music' });

  constructor() {
    // TODO MF: Using the name from the instrument instance instead of hardcoding this one here
    // This should also allow to define multiple instruments of the same type with different names!
    // The constructor of the instrument classes should contain an optional name to set the name when one is given!
    this.instruments.set('playnote-synth', new PlayNoteSynth()); // TODO MF: Polyphonizer sollte von Tone's Instrument Klasse erben
    this.instruments.set('kick', new DrumsKick());
    this.instruments.set('snare', new DrumsSnare());
    this.instruments.set('piano', new SampleLibrary()); // TODO MF: Mit der neuen Piano Klasse ersetzen
    this.instruments.set('hihat', new DrumsHiHat());

    this.connectAllInstrumentsToGain();
    this.connectAllInstrumentsToMasterMeter();
    this.createMetersForAllInstruments();

    // Connect to master output
    this.gain.toDestination();

    this.logger.info('Initialized successfully');
  }

  private connectAllInstrumentsToGain() {
    this.instruments.forEach((instrument: IMCPInstrument) => {
      instrument.getInstrument().connect(this.gain);
    });
  }

  private connectAllInstrumentsToMasterMeter() {
    const meter: Meter = new Meter(MusicService.METER_SMOOTHING_FACTOR);
    this.meters.set('master', meter);
    this.instruments.forEach((instrument: IMCPInstrument) => {
      instrument.getInstrument().connect(meter);
    });

    this.logger.info('Connected all instruments to master meter');
  }

  private createMetersForAllInstruments() {
    this.instruments.forEach((instrument: IMCPInstrument) => {
      const meter: Meter = new Meter(MusicService.METER_SMOOTHING_FACTOR);
      this.meters.set(instrument.name, meter);
      instrument.getInstrument().connect(meter);
    });
  }

  public getMeter(name: MeterName): Meter {
    // TODO MF: Error wenn der Meter nicht gefunden werden kann
    return this.meters.get(name) as Meter;
  }

  public getInstrument(name: InstrumentName): IMCPInstrument {
    return this.instruments.get(name); // TODO MF: Error wenn es dieses Instrument nicht gibt
  }

  // Wird im Moment nicht genutzt. So oder ähnlich wird das aber demnächst im Frontend gebraucht
  public getAllInstrumentNames(): InstrumentName[] {
    return Array.from(this.instruments.keys());
  }

}
