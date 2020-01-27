import { Component, OnInit } from '@angular/core';
import { BoxStateService } from './box-state.service';
import { GeneratorCommunicationService } from '../generator/library/generator-communication.service';
import { Logger } from '@upe/logger';

@Component({
  selector: 'mcp-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent implements OnInit {

  private readonly logger: Logger = new Logger({ name: 'Box Component' });

  public get useSynth(): boolean {
    return this.boxStateService.useSynth;
  }

  public set useSynth(state: boolean) {
    this.boxStateService.useSynth = state;
  }

  public get useKalimba(): boolean {
    return this.boxStateService.useKalimba;
  }

  public set useKalimba(state: boolean) {
    this.boxStateService.useKalimba = state;
  }

  constructor(private boxStateService: BoxStateService, private communicationService: GeneratorCommunicationService) { }

  ngOnInit() {
  }

  public activateSynth() {
    if (!this.useSynth) {
      this.useSynth = true;
      this.useKalimba = false;

      this.communicationService.sendMessage({
        address: "/box/switch",
        args: [
          { type: "s", value: "synth" },
        ],
        info: null
      });

      this.logger.info('Activating synth sound..');
    }
  }

  public activateKalimba() {
    if (!this.useKalimba) {
      this.useSynth = false;
      this.useKalimba = true;

      this.communicationService.sendMessage({
        address: "/box/switch",
        args: [
          { type: "s", value: "kalimba" },
        ],
        info: null
      });

      this.logger.info('Activating kalimba sound..');
    }
  }

}
