import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Draggable, Droppable, Swappable } from '@shopify/draggable';

@Component({
  selector: 'mcp-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent implements OnInit {

  @ViewChild('block', { static: true })
  block: ElementRef<HTMLElement>;

  constructor() { }

  ngOnInit() {
    const swappable = new Swappable(this.block.nativeElement, {
      draggable: '.item',
    });

    swappable.on('swappable:start', (event) => {
      console.log('swappable:start', event.data.dragEvent.source);
    });

    swappable.on('swappable:swapped', (event) => console.log('swappable:swapped', event));
    swappable.on('swappable:stop', (event) => console.log('swappable:stop', event));
  }

}
