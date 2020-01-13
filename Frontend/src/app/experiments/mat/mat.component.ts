import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Logger } from '@upe/logger';
import { GeneratorCommunicationService } from '../../generator/library/generator-communication.service';
import { ButtonIndex, Mat, Octave } from '../../generator/library/instruments/mat';
import { MusicService } from '../../generator/library/music.service';
import { Note } from '../../generator/library/types';

@Component({
  selector: 'mcp-mat',
  templateUrl: './mat.component.html',
  styleUrls: ['./mat.component.scss']
})
export class MatComponent implements OnInit, AfterViewInit {

  private logger: Logger = new Logger({ name: 'Mat Test' });

  public octave = "3";
  public scale = 'major';
  public rootNote = 'C';

  private mat: Mat;

  public notes: Note[] = [];
  public octaves: Octave[] = [];

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

  constructor(private communicationService: GeneratorCommunicationService, private musicService: MusicService) { }

  ngOnInit() {
    this.mat = this.musicService.getInstrument('mat') as Mat;
    this.setNotes();
  }

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
        this.logger.info(`Mouse Down Button ${index}`);
        this.trigger(index);
      });
      button.nativeElement.addEventListener("mouseup", (event: any) => {
        this.logger.info(`Mouse Up Button ${index}`);
        this.release(index);
      });
    });
  }

  private setNotes() {
    setTimeout(() => {
      this.notes = this.mat.notes.map((note) => note.substr(0, note.length - 1));
      this.octaves = this.mat.notes.map((note) => +note.substr(note.length - 1, note.length) as Octave);
    }, 100);
  }

  private trigger(index: ButtonIndex) {
    this.communicationService.sendMessage({
      address: "/mat/trigger",
      args: [
        { type: "i", value: index },
        { type: "f", value: 1 }
      ],
      info: null
    });
  }

  private release(index: ButtonIndex) {
    this.communicationService.sendMessage({
      address: "/mat/release",
      args: [
        { type: "i", value: index }
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
