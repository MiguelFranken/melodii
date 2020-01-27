import { Component, OnInit } from '@angular/core';
import { Logger } from '@upe/logger';
import { GeneratorCommunicationService } from '../generator/library/generator-communication.service';

@Component({
  selector: 'mcp-arc',
  templateUrl: './arc.component.html',
  styleUrls: ['./arc.component.scss']
})
export class ArcComponent implements OnInit {

  private logger: Logger = new Logger({ name: 'Arc Component' });

  public mapping: Map<string, boolean> = new Map();

  constructor(private communicationService: GeneratorCommunicationService) { }

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
      address: "/arc/switch",
      args: [
        { type: "s", value: note },
        { type: "i", value: newState ? 1 : 0 }
      ],
      info: null
    });
  }

}
