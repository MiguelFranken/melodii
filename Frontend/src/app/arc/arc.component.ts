import { Component, OnInit } from '@angular/core';
import { Logger } from '@upe/logger';
import { GeneratorCommunicationService } from '../generator/library/generator-communication.service';
import { NavigationService } from '../shared/layout/navigation/navigation.service';
import { ArcStateService } from './arc-state.service';

@Component({
  selector: 'mcp-arc',
  templateUrl: './arc.component.html',
  styleUrls: ['./arc.component.scss']
})
export class ArcComponent implements OnInit {

  private logger: Logger = new Logger({ name: 'Arc Component' });

  public get mapping(): Map<string, boolean> {
    return this.arcStateService.mapping;
  }

  public setMapping(note: string, state: boolean) {
    this.arcStateService.mapping.set(note, state);
    this.logger.info('Global mapping', this.arcStateService.mapping);
  }

  public get useVelocity(): boolean {
    return this.arcStateService.useVelocity;
  }

  public set useVelocity(state: boolean) {
    this.arcStateService.useVelocity = state;
  }

  public get isVelocityReversed(): boolean {
    return this.arcStateService.isVelocityReversed;
  }

  public set isVelocityReversed(state: boolean) {
    this.arcStateService.isVelocityReversed = state;
  }

  constructor(
    private communicationService: GeneratorCommunicationService,
    private navigationService: NavigationService,
    private arcStateService: ArcStateService) { }

  ngOnInit() {
  }

  switchNote(note: string) {
    const newState = !this.mapping.get(note);
    this.setMapping(note, newState);

    this.logger.info(`Switched ${note}`, { newState });

    this.communicationService.sendMessage({
      address: "/arc/switch/note",
      args: [
        { type: "s", value: note },
        { type: "i", value: newState ? 1 : 0 }
      ],
      info: null
    });
  }

  public switchNavigation() {
    this.navigationService.switchNavigation();
  }

  public switchVelocity() {
    this.useVelocity = !this.useVelocity;

    this.logger.info(`Switched velocity`, { useVelocity: this.useVelocity });

    this.communicationService.sendMessage({
      address: "/arc/switch/velocity",
      args: [
        { type: "i", value: this.useVelocity ? 1 : 0 }
      ],
      info: null
    });
  }

  public switchReversedVelocity() {
    this.isVelocityReversed = !this.isVelocityReversed;

    this.logger.info(`Switched velocity reversed mode`, { isVelocityReversed: this.isVelocityReversed });

    this.communicationService.sendMessage({
      address: "/arc/switch/reversed",
      args: [
        { type: "i", value: this.isVelocityReversed ? 1 : 0 }
      ],
      info: null
    });
  }

}
