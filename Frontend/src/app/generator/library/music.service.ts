import { Logger } from '@upe/logger';
import { Destination, Gain, JCReverb, Meter, PingPongDelay, Reverb, Split } from 'tone';
import { Injectable } from '@angular/core';
import { IMCPInstrument } from './mcp-instrument';

// Instruments
import { DrumsHiHat, DrumsKick, DrumsSnare } from './instruments/drums';
import { PlayNoteSynth } from './instruments/playnote_synth';
import { Piano } from './instruments/piano';
import { EffectChain } from './effect-chain';
import { InstrumentName, MeterName, IMCPEffect, MCPEffectIdentifier } from './types';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private static METER_SMOOTHING_FACTOR = 0.95;

  private instruments: Map<InstrumentName, IMCPInstrument> = new Map();

  private meters: Map<MeterName, Meter> = new Map();

  private gain = new Gain();

  private masterEffectChain: EffectChain;

  private logger: Logger = new Logger({ name: 'Music' });

  constructor() {
    // Logger.MuteType(LogType.DEBUG);

    // create instances of all our instruments
    this.instruments.set('playnote-synth', new PlayNoteSynth()); // TODO MF: Polyphonizer sollte von Tone's Instrument Klasse erben
    this.instruments.set('kick', new DrumsKick());
    this.instruments.set('snare', new DrumsSnare());
    this.instruments.set('piano', new Piano());
    this.instruments.set('hihat', new DrumsHiHat());

    // wires all the signals correctly for sound output
    this.connectAllInstrumentsToGain();

    // all instruments -> master effect chain -> destination (aka speakers)
    this.masterEffectChain = new EffectChain('master', this.gain, Destination);

    this.createMasterMeter();
    this.createMetersForAllInstruments();

    this.logger.info('Initialized successfully');
  }

  public getReverbEffect(): IMCPEffect {
    const toneEffect = new Reverb({
      decay : 1.7,
      preDelay : 0.01
    });
    toneEffect.wet.value = 0.27;
    toneEffect.generate();
    const reverb: IMCPEffect = {
      id: 'reverb',
      effect: toneEffect
    };
    return reverb;
  }

  public getPingPongDelayEffect(): IMCPEffect {
    const pingPongDelay: IMCPEffect = {
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
   * Creates a master meter so that the total volume can be measured.
   */
  private createMasterMeter() {
    const meterLeft: Meter = new Meter(MusicService.METER_SMOOTHING_FACTOR);
    const meterRight: Meter = new Meter(MusicService.METER_SMOOTHING_FACTOR);
    const split = new Split(2);
    Destination.connect(split);
    split.connect(meterLeft, 0);
    split.connect(meterRight, 1);
    this.meters.set("master-left", meterLeft);
    this.meters.set("master-right", meterRight);

    this.logger.info(`Created master meter`);
  }

  /**
   * Creates meters for each instrument so that the volume of each instrument
   * can also be measured independently of the other instruments. With this
   * method the instruments are also "wired" to this meter to make the measurement really possible.
   */
  private createMetersForAllInstruments() {
    this.instruments.forEach((instrument: IMCPInstrument, name: InstrumentName) => {
      const meterLeft = new Meter(MusicService.METER_SMOOTHING_FACTOR);
      const meterRight = new Meter(MusicService.METER_SMOOTHING_FACTOR);
      const split = new Split(2);
      this.meters.set(name + "-left", meterLeft);
      this.meters.set(name + "-right", meterRight);
      instrument.getAudioNode().connect(split);
      split.connect(meterLeft, 0); // 0 -> Left
      split.connect(meterRight, 1); // 1 -> Right
    });

    this.logger.info(`Created meters for all ${this.instruments.size} instruments and connected instruments to it`, this.meters);
  }

  /**
   * Returns the meter associated with the given name.
   * @param name Unique name of the meter
   */
  public getMeter(name: MeterName): Meter {
    if (!this.meters.has(name)) {
      this.logger.error(`Cannot find meter with name '${name}'`); // TODO MF: Errors in eine Klasse packen samt Error.Code und Stack-Trace
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
      // TODO MF: Errors in eine Klasse packen samt Error.Code und Stack-Trace
      this.logger.error(`Cannot find instrument with name '${name}'`);
    }
    return this.instruments.get(name);
  }

  // Wird im Moment nicht genutzt. So oder ähnlich wird das aber demnächst im Frontend gebraucht
  public getAllInstrumentNames(): InstrumentName[] {
    return Array.from(this.instruments.keys());
  }

}
