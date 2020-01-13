import { Logger } from '@upe/logger';
import { Destination, Gain, JCReverb, Meter, PingPongDelay, Reverb, Split } from 'tone';
import { Injectable } from '@angular/core';
import { IMCPInstrument } from './mcp-instrument';

// Instruments
import { DrumsHiHat, DrumsKick, DrumsSnare } from './instruments/drums';
import { Piano } from './instruments/piano';
import { Volume } from 'tone';
import { EffectChain } from './effect-chain';
import { InstrumentName, MeterName, IMCPEffect, MCPEffectIdentifier } from './types';
import { LogService } from '../log/log.service';
import { PlayNoteSynth } from './instruments/playnote_synth';
import { Mat } from './instruments/mat';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private static METER_SMOOTHING_FACTOR = 0.95;

  private instruments: Map<InstrumentName, IMCPInstrument> = new Map();
  private effectChains: Map<InstrumentName, EffectChain> = new Map();

  private meters: Map<MeterName, Meter> = new Map();

  private gain = new Gain();
  private volume = new Volume(0);

  private masterEffectChain: EffectChain;

  private logger: Logger = new Logger({ name: 'Music' });

  public setMasterVolume(dB: number) {
    this.volume.volume.value = dB;
  }

  public getMasterVolume() {
    return this.volume.volume.value;
  }

  public getLogService(): LogService {
    return this.logService;
  }

  constructor(private logService: LogService) {
    // Logger.MuteType(LogType.DEBUG);

    // create instances of all our instruments
    this.instruments.set('kick', new DrumsKick());
    this.instruments.set('snare', new DrumsSnare());
    this.instruments.set('piano', new Piano());
    this.instruments.set('hihat', new DrumsHiHat());
    this.instruments.set('playnote-synth', new PlayNoteSynth());
    this.instruments.set('mat', new Mat());

    this.instruments.forEach((instrument, name) => this.addInstrument(instrument, name));

    // master gain -> master effect chain -> volume node
    this.masterEffectChain = new EffectChain('master', this.gain, this.volume);

    // volume node -> destination (aka speakers)
    this.volume.connect(Destination);

    // master gain -> master meter
    this.createMasterMeter();

    this.logger.info('Initialized successfully');
  }

  public createEffect(effectName: MCPEffectIdentifier) {
    if (effectName === 'reverb') {
      return this.getReverbEffect();
    } else {
      return this.getPingPongDelayEffect();
    }
  }

  public addEffect(instrumentName: InstrumentName, effectName: MCPEffectIdentifier) {
    const effectChain = this.effectChains.get(instrumentName);
    if (!effectChain) {
      this.logger.error('addEffect');
    }
    const effect: IMCPEffect = this.createEffect(effectName);
    effectChain.pushEffect(effect);
  }

  public deleteEffect(instrumentName: InstrumentName, effectName: MCPEffectIdentifier) {
    const effectChain = this.effectChains.get(instrumentName);
    if (!effectChain) {
      this.logger.error('deleteEffect');
    }
    effectChain.deleteEffectByID(effectName);
  }

  public getReverbEffect(): IMCPEffect {
    const toneEffect = new Reverb({
      decay: 1.7,
      preDelay: 0.01
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

  public addInstrument(instrument: IMCPInstrument, instrumentName: InstrumentName) {
    this.logger.info(`Creating instrument ${instrumentName}.`);
    const effectChain = new EffectChain(instrumentName, instrument.getAudioNode());
    effectChain.getOutputNode().connect(this.gain);
    this.effectChains.set(instrumentName, effectChain);

    this.createMeter(effectChain, instrumentName);
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
   * Creates a meter for the instrument so that the volume of each instrument
   * can also be measured independently of the other instruments. With this
   * method the instrument is also "wired" to this meter to make the measurement really possible.
   */
  private createMeter(effectChain: EffectChain, instrumentName: InstrumentName) {
    const meterLeft = new Meter(MusicService.METER_SMOOTHING_FACTOR);
    const meterRight = new Meter(MusicService.METER_SMOOTHING_FACTOR);
    const split = new Split(2);
    this.meters.set(instrumentName + "-left", meterLeft);
    this.meters.set(instrumentName + "-right", meterRight);
    effectChain.getOutputNode().connect(split);
    split.connect(meterLeft, 0); // 0 -> Left
    split.connect(meterRight, 1); // 1 -> Right
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
