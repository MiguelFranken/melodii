import { SampleLibrary } from './sample-library';
import { Logger } from '@upe/logger';
import { Gain, JCReverb, Meter, PingPongDelay, Reverb } from 'tone';
import { Injectable } from '@angular/core';
import { DrumsKick } from './instruments/drums/drums_kick';
import { DrumsHiHat } from './instruments/drums/drums_hihat';
import { DrumsSnare } from './instruments/drums/drums_snare';
import { IMCPInstrument } from './mcp-instrument';
import { PlayNoteSynth } from './instruments/playnote_synth';
import { Piano } from './instruments/piano';
import { Effect } from 'tone/build/esm/effect/Effect';
import { StereoEffect } from 'tone/build/esm/effect/StereoEffect';
import { EffectChain } from './effect-chain';

/**
 * Unique name of an instrument
 */
export type InstrumentName = string;

/**
 * Unique name of an meter
 * Needed as we insert Meter objects in a Map and we access the objects via the name
 */
export type MeterName = InstrumentName | 'master';

/**
 *
 */
export type MCPEffectIdentifier = string;

export interface MCPEffect {
  id: MCPEffectIdentifier;
  effect: Effect<any> | StereoEffect<any>;
}

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private static METER_SMOOTHING_FACTOR = 0.9;

  private instruments: Map<InstrumentName, IMCPInstrument> = new Map();

  private meters: Map<MeterName, Meter> = new Map();

  private gain = new Gain(0.4);
  private outputGain = new Gain(0.4);

  private masterEffectChain: EffectChain;

  private logger: Logger = new Logger({ name: 'Music' });

  constructor() {
    // Logger.MuteType(LogType.DEBUG);

    // create instances of all our instruments
    this.instruments.set('playnote-synth', new PlayNoteSynth()); // TODO MF: Polyphonizer sollte von Tone's Instrument Klasse erben
    this.instruments.set('kick', new DrumsKick());
    this.instruments.set('snare', new DrumsSnare());
    this.instruments.set('pianoALT', new SampleLibrary()); // TODO MF: Das ist die alte Piano Klasse. Löschen?
    this.instruments.set('piano', new Piano());
    this.instruments.set('hihat', new DrumsHiHat());

    // wiring for meter
    // TODO: Effekte müssen hier auch mit betrachtet werden. Im Moment geht in die Meters nur das Instrumenten-Signal ein!
    this.connectAllInstrumentsToMasterMeter();
    this.createMetersForAllInstruments();

    // wires all the signals correctly for sound output
    this.connectAllInstrumentsToGain();
    const master = new Gain(0.4);
    this.masterEffectChain = new EffectChain('master', this.gain, this.outputGain);
    this.addPingPongDelayToMasterEffectChain();
    this.addReverbEffectToMasterEffectChain();
    this.outputGain.toDestination();

    this.logger.info('Initialized successfully');
  }

  public getReverbEffect(): MCPEffect {
    const toneEffect = new Reverb();
    toneEffect.generate();
    const reverb: MCPEffect = {
      id: 'reverb',
      effect: toneEffect
    };
    reverb.effect.wet.value = 0.35;
    return reverb;
  }

  public getPingPongDelayEffect(): MCPEffect {
    const pingPongDelay: MCPEffect = {
      id: 'pingpongdelay',
      effect: new PingPongDelay('4n', 0.2)
    };
    pingPongDelay.effect.wet.value = 0.5;
    return pingPongDelay;
  }

  public deleteEffectFromMasterEffectChain(effectID: MCPEffectIdentifier) {
    this.masterEffectChain.deleteEffectByID(effectID);
  }

  public addPingPongDelayToMasterEffectChain() {
    this.masterEffectChain.pushEffect(this.getPingPongDelayEffect());
  }

  public addReverbEffectToMasterEffectChain() {
    this.masterEffectChain.pushEffect(this.getReverbEffect());
  }

  /**
   * Connects all signal outputs of the instruments to the input of the gain node.
   */
  private connectAllInstrumentsToGain() {
    this.instruments.forEach((instrument: IMCPInstrument) => {
      instrument.getAudioNode().connect(this.gain);
    });

    this.logger.info(`Connected all ${this.instruments.size} instruments to gain node`);
  }

  /**
   * Adds all instruments to a master meter so that the total volume can be measured.
   */
  private connectAllInstrumentsToMasterMeter() {
    const meter: Meter = new Meter(MusicService.METER_SMOOTHING_FACTOR);
    this.meters.set('master', meter);
    this.instruments.forEach((instrument: IMCPInstrument) => {
      instrument.getAudioNode().connect(meter);
    });

    this.logger.info(`Connected all ${this.instruments.size} instruments to master meter`);
  }

  /**
   * Creates meters for each instrument so that the volume of each instrument
   * can also be measured independently of the other instruments. With this
   * method the instruments are also "wired" to this meter to make the measurement really possible.
   */
  private createMetersForAllInstruments() {
    this.instruments.forEach((instrument: IMCPInstrument) => {
      const meter: Meter = new Meter(MusicService.METER_SMOOTHING_FACTOR);
      this.meters.set(instrument.name, meter);
      instrument.getAudioNode().connect(meter);
    });

    this.logger.info(`Created meters for all ${this.instruments.size} instruments and connected instruments to it`);
  }

  /**
   * Returns the meter associated with the given name.
   * @param name Unique name of the meter
   */
  public getMeter(name: MeterName): Meter {
    if (!this.meters.has(name)) {
      this.logger.error('Cannot find meter'); // TODO MF: Errors in eine Klasse packen samt Error.Code und Stack-Trace
    }
    return this.meters.get(name) as Meter;
  }

  /**
   * Returns the meter associated with the given name.
   *
   * At the moment the names are still quite useless.
   * But later it should also be possible to have multiple instances of an MCP instrument.
   * These can then be given different names for identification.
   */
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
