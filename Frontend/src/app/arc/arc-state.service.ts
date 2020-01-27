import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArcStateService {

  public mapping: Map<string, boolean> = new Map();
  public useVelocity = true;
  public isVelocityReversed = false;

  constructor() {
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


}
