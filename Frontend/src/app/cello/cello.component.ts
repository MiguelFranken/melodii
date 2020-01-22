import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Logger } from "@upe/logger";
import { GeneratorCommunicationService } from "../generator/library/generator-communication.service";

@Component({
  selector: 'mcp-cello',
  templateUrl: './cello.component.html',
  styleUrls: ['./cello.component.scss']
})
export class CelloComponent implements OnInit {

  private logger: Logger = new Logger({ name: 'Arc Test' });

  @ViewChild('keyboard', {static: true})
  private keyboard: ElementRef<HTMLElement>;

  private buttonIDs = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];

  private static relativeHeight(offsetY, targetOffsetHeight) {
    const topZero = Math.min(1, Math.max(0, offsetY / targetOffsetHeight));
    return 1 - topZero;
  }

  constructor(private communicationService: GeneratorCommunicationService) { }

  ngOnInit() {
    for (const id of this.buttonIDs) {
      const myID = id;
      const el: any = document.getElementById(id.toLowerCase());
      el.addEventListener("mousemove", (event: any) => {
        const height = CelloComponent.relativeHeight(event.offsetY, event.target.offsetHeight);
        this.start(height, myID);
      });
      el.addEventListener("touchmove", (event: any) => {
        event.preventDefault();
        const t = event.changedTouches[0];
        const offsetY = t.clientY - t.target.offsetTop;
        const height = CelloComponent.relativeHeight(offsetY, t.target.offsetHeight);
        this.start(height, myID);
      });

      el.addEventListener("mouseleave", () => {
        this.stop(myID);
      });
      el.addEventListener("touchend", () => {
        this.stop(myID);
      });
    }
  }

  private start(height, myID) {
    this.set(myID, height);
  }

  private stop(myID) {
    this.set(myID, 0);
  }

  public set(note, strength) {
    this.logger.info(`Set ${note} to ${strength}.`);

    this.communicationService.sendMessage({
      address: "/cello/set",
      args: [
        { type: "s", value: note },
        { type: "i", value: strength }
      ],
      info: null
    });
  }

}
