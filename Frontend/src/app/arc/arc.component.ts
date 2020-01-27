import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mcp-arc',
  templateUrl: './arc.component.html',
  styleUrls: ['./arc.component.scss']
})
export class ArcComponent implements OnInit {

  public mapping: Map<string, boolean> = new Map();

  constructor() { }

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
    console.log(`Switch ${note}`);

    this.mapping.set(note, !this.mapping.get(note));
  }

}
