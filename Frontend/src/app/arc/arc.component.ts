import { Component, OnInit } from '@angular/core';
import { Logger } from '@upe/logger';
import { GeneratorCommunicationService } from '../generator/library/generator-communication.service';
import { NavigationService } from '../shared/layout/navigation/navigation.service';

@Component({
  selector: 'mcp-arc',
  templateUrl: './arc.component.html',
  styleUrls: ['./arc.component.scss']
})
export class ArcComponent implements OnInit {

  private logger: Logger = new Logger({ name: 'Arc Component' });

  public mapping: Map<string, boolean> = new Map();

  public useVelocity = true;
  public isVelocityReversed = false;

  constructor(private communicationService: GeneratorCommunicationService, private navigationService: NavigationService) { }

  ngOnInit() {
    this.mapping.set("C", true);
    this.mapping.set("C#", true);
    this.mapping.set("D", true);
    this.mapping.set("D#", true);
    this.mapping.set("E", true);
    this.mapping.set("F", true);
    this.mapping.set("G", true);
    this.mapping.set("G#", true);
    this.mapping.set("A", true);
    this.mapping.set("A#", true);
    this.mapping.set("B", true);
  }

  switchNote(note: string) {
    const newState = !this.mapping.get(note);
    this.mapping.set(note, newState);

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
  }

}
