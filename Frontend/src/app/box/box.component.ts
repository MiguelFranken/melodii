import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Swappable } from '@shopify/draggable';

@Component({
  selector: 'mcp-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent implements OnInit {

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
    });

    swappable.on('swappable:swapped', (event) => {
      this.sourceId = +event.data.dragEvent.data.source.firstElementChild.id;
      this.targetId = +event.data.dragEvent.data.over.firstElementChild.id;
    });

    swappable.on('drag:stop', (event) => {
      if (this.sourceId != null && this.targetId != null) {
        BoxComponent.Swap(this.data, this.getDataIndexFromId(this.sourceId), this.getDataIndexFromId(this.targetId));
        BoxComponent.Swap(this.orderedIDs, this.getDataIndexFromId(this.sourceId), this.getDataIndexFromId(this.targetId));
        this.targetId = null;
        this.sourceId = null;
      }
    });
  }

}
