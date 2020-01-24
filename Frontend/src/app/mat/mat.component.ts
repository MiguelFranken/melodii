import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Swappable } from '@shopify/draggable';
import { GeneratorCommunicationService } from '../generator/library/generator-communication.service';
import { Note } from '../generator/library/types';
import { ButtonIndex, Degree, Mat, Octave } from '../generator/library/instruments/mat';
import { MusicService } from '../generator/library/music.service';
import { Logger } from '@upe/logger';
import { OutsidePlacement, RelativePosition, Toppy } from 'toppy';
import { Overlay } from '../shared/help-overlay/help-overlay.service';
import { IOSCMessage } from '../shared/osc/osc-message';
import { MatStateService } from "./mat-state.service";
import { NavigationService } from "../shared/layout/navigation/navigation.service";

@Component({
  selector: 'mcp-mat',
  templateUrl: './mat.component.html',
  styleUrls: ['./mat.component.scss']
})
export class MatComponent implements OnInit, AfterViewInit {

  @ViewChild('octaveButton', { static: true, read: ElementRef })
  octaveButtonElement: ElementRef;

  @ViewChild('rootNoteButton', { static: true, read: ElementRef })
  rootNoteButtonElement: ElementRef;

  @ViewChild('scaleButton', { static: true, read: ElementRef })
  scaleButtonElement: ElementRef;

  @ViewChild('chordsButton', { static: true, read: ElementRef })
  chordsButtonElement: ElementRef;

  @ViewChild('effectsButton', { static: true, read: ElementRef })
  effectsButtonElement: ElementRef;

  @ViewChild('octaveMenuTemplate', { static: true })
  octaveMenuTemplate: TemplateRef<any>;

  @ViewChild('rootNoteMenuTemplate', { static: true })
  rootNoteMenuTemplate: TemplateRef<any>;

  @ViewChild('effectMenuTemplate', { static: true })
  effectMenuTemplate: TemplateRef<any>;

  @ViewChild('scaleMenuTemplate', { static: true })
  scaleMenuTemplate: TemplateRef<any>;

  @ViewChild('chordsMenuTemplate', { static: true })
  chordsMenuTemplate: TemplateRef<any>;

  private octaveMenuOverlay: Overlay;
  private rootNoteMenuOverlay: Overlay;
  private scaleMenuOverlay: Overlay;
  private chordsMenuOverlay: Overlay;
  private effectsMenuOverlay: Overlay;

  get isInChordMode(): boolean {
    return this.matStateService.getIsInChordMode();
  }

  set isInChordMode(value: boolean) {
    this.matStateService.setIsInChordMode(value);
  }

  private logger: Logger = new Logger({ name: 'Mat Component' });

  get editMode(): boolean {
    return this.matStateService.getIsInEditMode();
  }

  set editMode(value: boolean) {
    this.matStateService.setIsInEditMode(value);
  }

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

  get octave() {
    return this.matStateService.getCurrentOctave();
  }

  set octave(value) {
    this.matStateService.setCurrentOctave(value);
  }

  get scale() {
    return this.matStateService.getCurrentScale();
  }

  set scale(value) {
    this.matStateService.setCurrentScale(value);
  }

  get rootNote() {
    return this.matStateService.getCurrentRootNote();
  }

  set rootNote(value) {
    this.matStateService.setCurrentRootNote(value);
  }

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

  constructor(
    private communicationService: GeneratorCommunicationService,
    private musicService: MusicService,
    private matStateService: MatStateService,
    private navigationService: NavigationService,
    private toppy: Toppy) { }

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
    return this.mapping.get(key);
  }

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

  public increaseOctave() {
    this.logger.info(`Increase octave ${this.octave}`);

    let newOctave = +this.octave;
    if (newOctave < 5) {
      newOctave = newOctave + 1;
    }

    this.octave = `${newOctave}`;
    this.changeOctave();
  }

  public decreaseOctave() {
    this.logger.info(`Decrease octave ${this.octave}`);

    let newOctave = +this.octave;
    if (newOctave > 1) {
      newOctave = newOctave - 1;
    }

    this.octave = `${newOctave}`;
    this.changeOctave();
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

  public switchToMajorScale() {
    this.scale = "major";
    this.changeScale();
  }

  public switchToMinorScale() {
    this.scale = "minor";
    this.changeScale();
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

  private initOctaveMenuOverlay() {
    const position = new RelativePosition({
      placement: OutsidePlacement.BOTTOM_LEFT,
      src: this.octaveButtonElement.nativeElement
    });

    this.octaveMenuOverlay = this.toppy
      .position(position)
      .config({
        closeOnDocClick: true
      })
      .content(this.octaveMenuTemplate, { name: 'Johny' })
      .create();

    this.logger.info('Initialized help menu overlay');
  }

  public showOctaveMenu() {
    this.initOctaveMenuOverlay();
    this.octaveMenuOverlay.open();
  }

  private initScaleMenuOverlay() {
    const position = new RelativePosition({
      placement: OutsidePlacement.BOTTOM_LEFT,
      src: this.scaleButtonElement.nativeElement
    });

    this.scaleMenuOverlay = this.toppy
      .position(position)
      .config({
        closeOnDocClick: true
      })
      .content(this.scaleMenuTemplate, { name: 'Johny' })
      .create();

    this.logger.info('Initialized help menu overlay');
  }

  public showScaleMenu() {
    this.initScaleMenuOverlay();
    this.scaleMenuOverlay.open();
  }

  private initRootNoteMenuOverlay() {
    const position = new RelativePosition({
      placement: OutsidePlacement.BOTTOM_LEFT,
      src: this.rootNoteButtonElement.nativeElement
    });

    this.rootNoteMenuOverlay = this.toppy
      .position(position)
      .config({
        closeOnDocClick: true
      })
      .content(this.rootNoteMenuTemplate, { name: 'Johny' })
      .create();

    this.logger.info('Initialized help menu overlay');
  }

  public showRootNoteMenu() {
    this.initRootNoteMenuOverlay();
    this.rootNoteMenuOverlay.open();
  }

  private initChordsMenuOverlay() {
    const position = new RelativePosition({
      placement: OutsidePlacement.BOTTOM_LEFT,
      src: this.chordsButtonElement.nativeElement
    });

    this.chordsMenuOverlay = this.toppy
      .position(position)
      .config({
        closeOnDocClick: true
      })
      .content(this.chordsMenuTemplate, { name: 'Johny' })
      .create();

    this.logger.info('Initialized help menu overlay');
  }

  public showChordsMenu() {
    this.initChordsMenuOverlay();
    this.chordsMenuOverlay.open();
  }

  private initEffectsMenuOverlay() {
    const position = new RelativePosition({
      placement: OutsidePlacement.BOTTOM_LEFT,
      src: this.effectsButtonElement.nativeElement
    });

    this.effectsMenuOverlay = this.toppy
      .position(position)
      .config({
        closeOnDocClick: true
      })
      .content(this.effectMenuTemplate, { name: 'Johny' })
      .create();

    this.logger.info('Initialized help menu overlay');
  }

  public showEffectsMenu() {
    this.initEffectsMenuOverlay();
    this.effectsMenuOverlay.open();
  }

  public switchNavigation() {
    this.navigationService.switchNavigation();
  }

  public switchChordMode() {
    this.isInChordMode = !this.isInChordMode;

    const oscMessage: IOSCMessage = {
      address: '/mat/chords',
      args: [
        { type: 'i', value: this.isInChordMode ? 1 : 0 }
      ],
      info: {
        address: '/play_note',
        family: 'IPv4',
        port: 80,
        size: 1,
      }
    };

    this.communicationService.sendMessage(oscMessage);

    this.logger.debug('Switched chord mode');
  }

}
