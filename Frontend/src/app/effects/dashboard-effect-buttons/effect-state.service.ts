import { Injectable } from '@angular/core';
import { InstrumentName } from '../../generator/library/types';

@Injectable({
  providedIn: 'root'
})
export class EffectStateService {

  public useReverb: Map<InstrumentName, boolean> = new Map();
  public usePingPongDelay: Map<InstrumentName, boolean> = new Map();

  public useEQ: Map<InstrumentName, boolean> = new Map();
  public useEQLow: Map<InstrumentName, boolean> = new Map();
  public useEQMid: Map<InstrumentName, boolean> = new Map();
  public useEQHigh: Map<InstrumentName, boolean> = new Map();

  constructor() {
    this.useReverb.set('mat', false);
    this.usePingPongDelay.set('mat', false);
    this.useEQ.set('mat', false);
    this.useEQLow.set('mat', false);
    this.useEQMid.set('mat', false);
    this.useEQHigh.set('mat', false);
  }

  public isUsedReverb(instrumentName: InstrumentName): boolean {
    return this.useReverb.get(instrumentName);
  }

  public setIsUsedReverb(instrumentName: InstrumentName, value: boolean) {
    this.useReverb.set(instrumentName, value);
  }

  public isUsedPingPongDelay(instrumentName: InstrumentName): boolean {
    return this.usePingPongDelay.get(instrumentName);
  }

  public setIsUsedPingPongDelay(instrumentName: InstrumentName, value: boolean) {
    this.usePingPongDelay.set(instrumentName, value);
  }

  public isUsedEQ(instrumentName: InstrumentName): boolean {
    return this.useEQ.get(instrumentName);
  }

  public setIsUsedEQ(instrumentName: InstrumentName, value: boolean) {
    this.useEQ.set(instrumentName, value);
  }

  public isUsedEQLow(instrumentName: InstrumentName): boolean {
    return this.useEQLow.get(instrumentName);
  }

  public setIsUsedEQLow(instrumentName: InstrumentName, value: boolean) {
    this.useEQLow.set(instrumentName, value);
  }

  public isUsedEQMid(instrumentName: InstrumentName): boolean {
    return this.useEQMid.get(instrumentName);
  }

  public setIsUsedEQMid(instrumentName: InstrumentName, value: boolean) {
    this.useEQMid.set(instrumentName, value);
  }

  public isUsedEQHigh(instrumentName: InstrumentName): boolean {
    return this.useEQHigh.get(instrumentName);
  }

  public setIsUsedEQHigh(instrumentName: InstrumentName, value: boolean) {
    this.useEQHigh.set(instrumentName, value);
  }

}
