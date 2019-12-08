import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Swappable } from '@shopify/draggable';

@Component({
  selector: 'mcp-mat',
  templateUrl: './mat.component.html',
  styleUrls: ['./mat.component.scss']
})
export class MatComponent implements OnInit {

  public data = ["C", "D", "E", "F", "G"];
  public orderedIDs = [0, 1, 2, 3, 4];

  @ViewChild('block', { static: true })
  block: ElementRef<HTMLElement>;

  private sourceId: number | null;
  private targetId: number | null;

  private static Swap(array, sourceID, targetID) {
    const b = array[sourceID];
    array[sourceID] = array[targetID];
    array[targetID] = b;
  }

  constructor() { }

  private getDataIndexFromId(id: number) {
    return this.orderedIDs.findIndex((i) => i === +id);
  }

  getNote(id: number): string {
    const dataIndex = this.getDataIndexFromId(id);
    return this.data[dataIndex];
  }

  ngOnInit() {
    const swappable = new Swappable(this.block.nativeElement, {
      draggable: '.item',
      mirror: {
        appendTo: 'body',
        constrainDimensions: true,
      }
    });

    swappable.on('swappable:swapped', (event) => {
      this.sourceId = +event.data.dragEvent.data.source.firstElementChild.id;
      this.targetId = +event.data.dragEvent.data.over.firstElementChild.id;
    });

    swappable.on('drag:stop', (event) => {
      if (this.sourceId != null && this.targetId != null) {
        MatComponent.Swap(this.data, this.getDataIndexFromId(this.sourceId), this.getDataIndexFromId(this.targetId));
        MatComponent.Swap(this.orderedIDs, this.getDataIndexFromId(this.sourceId), this.getDataIndexFromId(this.targetId));
        this.targetId = null;
        this.sourceId = null;

        // TODO MF: Create OSC Message(s) for the changes and send them to the OSC Server
      }
    });
  }

}
