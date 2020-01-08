import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Swappable } from '@shopify/draggable';
import { GeneratorCommunicationService } from '../generator/library/generator-communication.service';

@Component({
  selector: 'mcp-mat',
  templateUrl: './mat.component.html',
  styleUrls: ['./mat.component.scss']
})
export class MatComponent implements OnInit {

  private mapping = new Map([
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4]
  ]);

  @ViewChild('block', { static: true })
  block: ElementRef<HTMLElement>;

  private swapInfo: { firstId: number, secondId: number } | null;

  private swap(firstId, secondId) {
    const firstIndex = this.mapping.get(firstId);
    const secondIndex = this.mapping.get(secondId);

    this.communicationService.sendMessage({
      address: "/mat/swap",
      args: [
        { type: "i", value: firstIndex },
        { type: "i", value: secondIndex }
      ],
      info: null
    });

    // Swappable swaps the elements including their id,
    // so we need to keep track of where each element is.
    this.mapping.set(firstId, secondIndex);
    this.mapping.set(secondId, firstIndex);
  }

  constructor(private communicationService: GeneratorCommunicationService) { }

  ngOnInit() {
    const swappable = new Swappable(this.block.nativeElement, {
      draggable: '.item',
      mirror: {
        appendTo: 'body',
        constrainDimensions: true,
      }
    });

    swappable.on('swappable:swapped', (event) => {
      this.swapInfo = {
        firstId: Number(event.data.dragEvent.data.source.firstElementChild.id),
        secondId: Number(event.data.dragEvent.data.over.firstElementChild.id),
      };
    });

    swappable.on('drag:stop', (event) => {
      if (this.swapInfo) {
        this.swap(this.swapInfo.firstId, this.swapInfo.secondId);
        this.swapInfo = null;

        // TODO MF: Create OSC Message(s) for the changes and send them to the OSC Server
      }
    });
  }

}
