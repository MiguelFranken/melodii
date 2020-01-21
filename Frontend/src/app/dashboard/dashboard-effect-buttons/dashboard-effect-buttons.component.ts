import { Component, Input, OnInit } from '@angular/core';
import { Logger } from "@upe/logger";
import { GeneratorCommunicationService } from "../../generator/library/generator-communication.service";
import { IOSCMessage } from "../../shared/osc/osc-message";
import { InstrumentName } from "../../generator/library/types";

@Component({
  selector: 'mcp-dashboard-effect-buttons',
  templateUrl: './dashboard-effect-buttons.component.html',
  styleUrls: ['./dashboard-effect-buttons.component.scss']
})
export class DashboardEffectButtonsComponent implements OnInit {

  @Input()
  instrumentName: InstrumentName;

  private logger: Logger = new Logger({ name: 'DashboardEffectButtonsComponent', flags: ['component'] });

  public useReverb = false;
  public usePingPongDelay = false;

  public useEQ = false;
  public useEQLow = false;
  public useEQMid = false;
  public useEQHigh = false;

  constructor(private communicationService: GeneratorCommunicationService) { }

  ngOnInit() {
  }

  public switchReverb() {
    this.useReverb = !this.useReverb;

    const oscMessage: IOSCMessage = {
      address: '/effect/instrument/reverb',
      args: [
        { type: 's', value: this.instrumentName },
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
      address: '/effect/instrument/pingpongdelay',
      args: [
        { type: 's', value: this.instrumentName },
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
      address: '/effect/instrument/eq',
      args: [
        { type: 's', value: this.instrumentName },
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
      address: '/effect/instrument/eq/low',
      args: [
        { type: 's', value: this.instrumentName },
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
      address: '/effect/instrument/eq/mid',
      args: [
        { type: 's', value: this.instrumentName },
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
      address: '/effect/instrument/eq/high',
      args: [
        { type: 's', value: this.instrumentName },
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
