import { Component, OnInit } from '@angular/core';
import { GeneratorCommunicationService } from '../../generator/library/generator-communication.service';
import { Logger } from '@upe/logger';

@Component({
  selector: 'mcp-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent implements OnInit {

  private logger: Logger = new Logger({ name: 'Box Test' });

  private clientX;
  private xStart;

  public volume = 100;
  public pitchShift = 0;

  private static relativeHeight(offsetY, targetOffsetHeight) {
    const topZero = Math.min(1, Math.max(0, offsetY / targetOffsetHeight));
    const bottomZero = 1 - topZero;
    return bottomZero;
  }

  constructor(private communicationService: GeneratorCommunicationService) { }

  ngOnInit() {
    const buttonIDs = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];

    for (const id of buttonIDs) {
      const myID = id;
      const el = document.getElementById(id.toLowerCase());

      el.addEventListener("mousedown", (event: any) => {
        event.preventDefault();
        this.logger.info("Mousedown");
        const height = BoxComponent.relativeHeight(event.offsetY, event.target.offsetHeight);
        this.start(height, event.clientX, myID);
      });

      el.addEventListener("touchstart", (event: any) => {
        this.logger.info("Touchstart");
        event.preventDefault(); // Prevent mouse event.
        const t = event.changedTouches[0];
        const offsetY = t.clientY - t.target.offsetTop;
        const height = BoxComponent.relativeHeight(offsetY, t.target.offsetHeight);
        this.start(height, t.clientX, myID);
      });

      el.addEventListener("mouseleave", (event) => {
        event.preventDefault();
        this.logger.info("Mouseleave");
        this.stop(myID);
      });

      el.addEventListener("touchleave", (event) => {
        event.preventDefault();
        this.logger.info("Touchleave");
        event.preventDefault();
        this.stop(myID);
      });

      el.addEventListener("mouseup", (event) => {
        event.preventDefault();
        this.logger.info("Mouseup");
        this.stop(myID);
      });

      el.addEventListener("touchend", (event) => {
        event.preventDefault();
        this.logger.info("Touchend");
        event.preventDefault();
        this.stop(myID);
      });
    }
  }

  private trigger(note, velocity) {
    this.logger.info(`Trigger ${note}.`);
    this.communicationService.sendMessage({
      address: "/box/trigger",
      args: [
        { type: "s", value: note },
        { type: "f", value: velocity }
      ],
      info: null,
    });
  }

  private detune(cents) {
    this.logger.info(`Detune.`);
    this.communicationService.sendMessage({
      address: "/box/detune",
      args: [
        { type: "i", value: cents }
      ],
      info: null
    });
  }

  private release(note) {
    this.logger.info(`Release ${note}.`);
    this.communicationService.sendMessage({
      address: "/box/release",
      args: [
        { type: "s", value: note }
      ],
      info: null
    });
  }

  private setVolume(loudness) {
    this.logger.info(`Set volume ${loudness}.`);
    this.communicationService.sendMessage({
      address: "/box/setVolume",
      args: [
        { type: "f", value: loudness }
      ],
      info: null
    });
  }

  private stop(myID) {
    this.xStart = null;
    this.release(myID);
  }

  private start(relativeHeight, clientX, myID) {
    const velocity = relativeHeight;
    this.xStart = clientX;
    this.trigger(myID, velocity);
  }

  public pitchChanged(event) {
    this.pitchShift = event.value;
    this.detune(this.pitchShift);
  }

  public volumeChanged(event) {
    this.volume = event.value;
    this.setVolume(this.volume / 100);
  }
}
