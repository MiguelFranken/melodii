import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Swappable } from '@shopify/draggable';
import { GeneratorCommunicationService } from '../generator/library/generator-communication.service';
import { Note } from '../generator/library/types';
import { ButtonIndex, Degree, Mat, Octave } from '../generator/library/instruments/mat';
import { MusicService } from '../generator/library/music.service';
import { Logger } from '@upe/logger';

@Component({
  selector: 'mcp-mat',
  templateUrl: './mat.component.html',
  styleUrls: ['./mat.component.scss']
})
export class MatComponent implements OnInit, AfterViewInit {

  private logger: Logger = new Logger({ name: 'Mat Component' });

  private editMode = false;

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

  public octave = "3";
  public scale = 'major';
  public rootNote = 'C';

  @ViewChild('block', { static: true })
  block: ElementRef<HTMLElement>;

  @ViewChild('button0', {static: true})
  private button0: ElementRef<HTMLElement>;

  @ViewChild('button1', {static: true})
  private button1: ElementRef<HTMLElement>;

  @ViewChild('button2', {static: true})
  private button2: ElementRef<HTMLElement>;

  @ViewChild('button3', {static: true})
  private button3: ElementRef<HTMLElement>;

  @ViewChild('button4', {static: true})
  private button4: ElementRef<HTMLElement>;

  @ViewChild('button5', {static: true})
  private button5: ElementRef<HTMLElement>;

  @ViewChild('button6', {static: true})
  private button6: ElementRef<HTMLElement>;

  @ViewChild('button7', {static: true})
  private button7: ElementRef<HTMLElement>;

  private buttons: ElementRef<HTMLElement>[];

  private swapInfo: { firstId: number, secondId: number } | null;

  ngAfterViewInit(): void {
    this.buttons = [
      this.button0,
      this.button1,
      this.button2,
      this.button3,
      this.button4,
      this.button5,
      this.button6,
      this.button7
    ];

    this.buttons.forEach((button, index) => {
      button.nativeElement.addEventListener("mousedown", (event: any) => {
        if (!this.editMode) {
          this.logger.info(`Mouse Down Button ${index}`);
          this.trigger(index);
        }
      });
      button.nativeElement.addEventListener("touchstart", (event: any) => {
        if (!this.editMode) {
          this.logger.info(`Mouse Down Button ${index}`);
          this.trigger(index);
        }
      });
      button.nativeElement.addEventListener("mouseup", (event: any) => {
        if (!this.editMode) {
          this.logger.info(`Mouse Up Button ${index}`);
          this.release(index);
        }
      });
      button.nativeElement.addEventListener("touchend", (event: any) => {
        if (!this.editMode) {
          this.logger.info(`Mouse Up Button ${index}`);
          this.release(index);
        }
      });
    });
  }

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

    this.setNotes();
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

    swappable.on('swappable:start', (event) => {
      if (!this.editMode) {
        swappable.dragging = false;
        event.cancel();
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
        this.logger.info("index for button 0", this.getIndex(0));
        this.logger.info("index for button 1", this.getIndex(1));
      }
    });
  }

  private setNotes() {
    setTimeout(() => {
      this.notes = this.mat.notes.map((note) => note.substr(0, note.length - 1));
      this.octaves = this.mat.notes.map((note) => +note.substr(note.length - 1, note.length) as Octave);
      this.degrees = [...this.mat.degrees];
      this.logger.info('Set notes', this.notes);
    }, 100);
  }

  public onSwapNotesButtonPressed() {
    this.editMode = !this.editMode;
  }

  public getIndex(key: number) {
    const test = [...this.mapping.entries()]
      .filter(({ 1: v }) => v === key)
      .map(([k]) => k);
    return test[0];
  }

  // private setNotes() {
  //   setTimeout(() => {
  //     this.notes = this.mat.notes.map((note) => note.substr(0, note.length - 1));
  //     this.octaves = this.mat.notes.map((note) => +note.substr(note.length - 1, note.length) as Octave);
  //     this.degrees = this.mat.degrees;
  //   }, 100);
  // }

  private trigger(index: ButtonIndex) {
    this.logger.info("found mapping", this.mapping.get(index));

    this.communicationService.sendMessage({
      address: "/mat/trigger",
      args: [
        { type: "i", value: this.mapping.get(index) },
        { type: "f", value: 1 }
      ],
      info: null
    });
  }

  private release(index: ButtonIndex) {
    this.communicationService.sendMessage({
      address: "/mat/release",
      args: [
        { type: "i", value: this.mapping.get(index) }
      ],
      info: null
    });
  }

  public changeOctave() {
    this.logger.info(`Change octave ${this.octave}`);
    this.communicationService.sendMessage({
      address: "/mat/change_octave",
      args: [
        { type: "i", value: +this.octave }
      ],
      info: null
    });

    this.setNotes();
  }

  public changeRootNote() {
    this.logger.info(`Change root note ${this.rootNote}`);
    this.communicationService.sendMessage({
      address: "/mat/change_root",
      args: [
        { type: "s", value: this.rootNote }
      ],
      info: null
    });

    this.setNotes();
  }

  public changeScale() {
    this.logger.info(`Change scale ${this.scale}`);
    this.communicationService.sendMessage({
      address: "/mat/change_scale",
      args: [
        { type: "s", value: this.scale }
      ],
      info: null
    });

    this.setNotes();
  }

}
