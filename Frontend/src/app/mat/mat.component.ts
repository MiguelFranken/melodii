import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Swappable } from '@shopify/draggable';
import { GeneratorCommunicationService } from '../generator/library/generator-communication.service';
import { Note } from '../generator/library/types';
import { Degree, Mat, Octave } from '../generator/library/instruments/mat';
import { MusicService } from '../generator/library/music.service';

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
    [4, 4],
    [5, 5],
    [6, 6],
    [7, 7],
  ]);

  private mat: Mat;

  public notes: Note[] = [];
  public octaves: Octave[] = [];
  public degrees: Degree[] = [];

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

  constructor(private communicationService: GeneratorCommunicationService, private musicService: MusicService) { }

  ngOnInit() {
    this.mat = this.musicService.getInstrument('mat') as Mat;
    this.setNotes();

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
        console.log(this.swapInfo);
        this.swap(this.swapInfo.firstId - 1, this.swapInfo.secondId - 1);
        this.swapInfo = null;
      }
    });
  }

  private setNotes() {
    setTimeout(() => {
      this.notes = this.mat.notes.map((note) => note.substr(0, note.length - 1));
      this.octaves = this.mat.notes.map((note) => +note.substr(note.length - 1, note.length) as Octave);
      this.degrees = [...this.mat.degrees];
    }, 100);
  }

}
