import { Component, Input, OnInit } from '@angular/core';
import { InstrumentName } from "../../generator/library/types";
import { Logger } from "@upe/logger";
import { GeneratorCommunicationService } from "../../generator/library/generator-communication.service";
import { EffectStateService } from "../dashboard-effect-buttons/effect-state.service";
import { IOSCMessage } from "../../shared/osc/osc-message";

@Component({
  selector: 'mcp-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {

  @Input()
  instrumentName: InstrumentName;

  private logger: Logger = new Logger({ name: 'DashboardEffectButtonsComponent', flags: ['component'] });

  get useReverb(): boolean {
    return this.effectStateService.isUsedReverb(this.instrumentName);
  }

  set useReverb(value: boolean) {
    this.effectStateService.setIsUsedReverb(this.instrumentName, value);
  }

  get usePingPongDelay(): boolean {
    return this.effectStateService.isUsedPingPongDelay(this.instrumentName);
  }

  set usePingPongDelay(value: boolean) {
    this.effectStateService.setIsUsedPingPongDelay(this.instrumentName, value);
  }

  get useEQ(): boolean {
    return this.effectStateService.isUsedEQ(this.instrumentName);
  }

  set useEQ(value: boolean) {
    this.effectStateService.setIsUsedEQ(this.instrumentName, value);
  }

  get useEQLow(): boolean {
    return this.effectStateService.isUsedEQLow(this.instrumentName);
  }

  set useEQLow(value: boolean) {
    this.effectStateService.setIsUsedEQLow(this.instrumentName, value);
  }

  get useEQMid(): boolean {
    return this.effectStateService.isUsedEQMid(this.instrumentName);
  }

  set useEQMid(value: boolean) {
    this.effectStateService.setIsUsedEQMid(this.instrumentName, value);
  }

  get useEQHigh(): boolean {
    return this.effectStateService.isUsedEQHigh(this.instrumentName);
  }

  set useEQHigh(value: boolean) {
    this.effectStateService.setIsUsedEQHigh(this.instrumentName, value);
  }

  constructor(private communicationService: GeneratorCommunicationService, public effectStateService: EffectStateService) { }

  ngOnInit() {
  }

  public switchReverb() {
    this.useReverb = !this.useReverb;

    const oscMessage: IOSCMessage = {
      address: '/effect/master/reverb',
      args: [
        { type: 'i', value: this.useReverb ? 1 : 0 }
      ],
      info: null
    };

    this.communicationService.sendMessage(oscMessage);

    this.logger.debug('Switched reverb effect');
  }

  public switchPingPongDelay() {
    this.usePingPongDelay = !this.usePingPongDelay;

    const oscMessage: IOSCMessage = {
      address: '/effect/master/pingpongdelay',
      args: [
        { type: 'i', value: this.usePingPongDelay ? 1 : 0 }
      ],
      info: null
    };

    this.communicationService.sendMessage(oscMessage);

    this.logger.debug('Switched pingpongdelay effect');
  }

  public switchEQ() {
    this.useEQ = !this.useEQ;

    if (!this.useEQ) {
      this.useEQLow = false;
      this.useEQMid = false;
      this.useEQHigh = false;
    } else if (!this.useEQLow && !this.useEQMid && !this.useEQHigh) {
      this.useEQLow = true;
      this.useEQMid = true;
      this.useEQHigh = true;
    }

    const oscMessage: IOSCMessage = {
      address: '/effect/master/eq',
      args: [
        { type: 'i', value: this.useEQ ? 1 : 0 }
      ],
      info: null
    };

    this.communicationService.sendMessage(oscMessage);

    this.logger.debug('Switched EQ effect');
  }

  public switchEQLow() {
    this.useEQLow = !this.useEQLow;

    if (!this.useEQ) {
      this.switchEQ();
    }

    this.sendEQLow();
    this.sendEQMid();
    this.sendEQHigh();

    this.checkIfEQIsStillActive();

    this.logger.debug('Switched low gain of master');
  }

  public checkIfEQIsStillActive() {
    if (!this.useEQLow && !this.useEQMid && !this.useEQHigh) {
      this.switchEQ();
    }
  }

  public sendEQLow() {
    const oscMessage: IOSCMessage = {
      address: '/effect/master/eq/low',
      args: [
        { type: 'i', value: this.useEQLow ? 0 : -10 }
      ],
      info: {
        address: '/play_note',
        family: 'IPv4',
        port: 80,
        size: 1,
      }
    };

    this.communicationService.sendMessage(oscMessage);
  }

  public sendEQMid() {
    const oscMessage: IOSCMessage = {
      address: '/effect/master/eq/mid',
      args: [
        { type: 'i', value: this.useEQMid ? 0 : -10 }
      ],
      info: {
        address: '/play_note',
        family: 'IPv4',
        port: 80,
        size: 1,
      }
    };

    this.communicationService.sendMessage(oscMessage);
  }

  public sendEQHigh() {
    const oscMessage: IOSCMessage = {
      address: '/effect/master/eq/high',
      args: [
        { type: 'i', value: this.useEQHigh ? 0 : -10 }
      ],
      info: {
        address: '/play_note',
        family: 'IPv4',
        port: 80,
        size: 1,
      }
    };

    this.communicationService.sendMessage(oscMessage);
  }

  public switchEQMid() {
    this.useEQMid = !this.useEQMid;

    if (!this.useEQ) {
      this.switchEQ();
    }

    this.sendEQLow();
    this.sendEQMid();
    this.sendEQHigh();

    this.checkIfEQIsStillActive();

    this.logger.debug('Switched mid gain');
  }

  public switchEQHigh() {
    this.useEQHigh = !this.useEQHigh;

    if (!this.useEQ) {
      this.switchEQ();
    }

    this.sendEQLow();
    this.sendEQMid();
    this.sendEQHigh();

    this.checkIfEQIsStillActive();

    this.logger.debug('Switched high gain');
  }

}
