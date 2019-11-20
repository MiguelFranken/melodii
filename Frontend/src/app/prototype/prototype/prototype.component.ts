import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { interval, Observable, Subject, Subscription } from 'rxjs';
import { SocketService } from '../../shared/socket/socket.service';
import { Action } from '../../shared/socket/action';
import { switchMap } from 'rxjs/operators';
import { MatMenuTrigger } from '@angular/material/menu';
import { NavigationService } from '../../shared/layout/navigation/navigation.service';
import { Matrix } from './matrix';
import { Row } from './row';
import { RowButton } from './row-button';
import { OutsidePlacement, RelativePosition, Toppy } from 'toppy';

const NOTES_PENTATONIC_C = [
  'C',
  'D',
  'E',
  'A',
  'G'
];
const NOTES_MAJOR_C = [
  'C',
  'D',
  'E',
  'F',
  'G',
  'A',
  'B'
];

const DEFAULT_BPM = 80;

const NUMBER_OF_COLUMNS = 8;
const NUMBER_OF_ROWS = 30;

@Component({
  selector: 'app-prototype',
  templateUrl: './prototype.component.html',
  styleUrls: ['./prototype.component.scss']
})
export class PrototypeComponent implements OnInit {

  public set bpm(bpm: number) {
    this._bpm = bpm;
    this.msPerBeat = 1000 * 0.5 * (60 / bpm);
  }

  public get bpm(): number {
    return this._bpm;
  }

  constructor(
    private socketService: SocketService,
    private navigationService: NavigationService,
    private _toppy: Toppy) { }

  public height = '100%';

  private matrixCollection: Matrix[] = [];
  private matrixCollectionIndex = 0;
  public matrix: Matrix;

  public showVelocity = false;

  private _bpm: number = DEFAULT_BPM;

  private subject = new Subject();
  private interval;

  private msPerBeat: number = 1000 * 0.5 * (60 / DEFAULT_BPM); // TODO MF: different default

  public temp = 0;

  private playSubscription: Subscription;

  public showRowNames = true;

  public isClosedNavigation: Observable<boolean>;

  @ViewChild('el', {static: true, read: ElementRef })
  el: ElementRef;

  @ViewChild('tpl', {static: true})
  tpl: TemplateRef<any>;

  private overlay;

  // public switchShowRowNames() {
  //   this.showRowNames = !this.showRowNames;
  // }

  public isInExpandedMode = true;

  private isInFoldMode = false;

  @ViewChild(MatMenuTrigger, {static: false})
  contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  private clicked = false;

  public switchVelocity() {
    this.showVelocity = !this.showVelocity;
  }

  setVelocity(event, button: RowButton) {
    button.velocity = event.value;
  }

  public switchRow(row: Row) {
    row.isExpanded = !row.isExpanded;
  }

  changeBpm(event) {
    this.bpm = event.value;
  }

  private initOverlay() {
    const position = new RelativePosition({
      placement: OutsidePlacement.BOTTOM_LEFT,
      src: this.el.nativeElement
    });

    this.overlay = this._toppy
      .position(position)
      .config({
        closeOnDocClick: true
      })
      .content(this.tpl, { name: 'Johny' })
      .create();
  }

  open() {
    this.overlay.open();
  }

  close() {
    this.overlay.close();
  }

  ngOnInit() {
    this.initOverlay();
    this.isClosedNavigation = this.navigationService.getIsClosedObservable();
    this.isClosedNavigation.subscribe(value => {
      if (value) {
        this.height = '100%';
      } else {
        this.height = '99.99%'; // safari height fix
      }
    });

    this.interval = this.subject.pipe(switchMap((period: number) => interval(period)));
    this.socketService.initSocket();
    this.createMatrixDrums();
    this.createMatrixPiano();

    this.matrix = this.matrixCollection[this.matrixCollectionIndex];
  }

  public switchMatrix(matrix: Matrix, index: number) {
    this.matrix = matrix;
    this.matrixCollectionIndex = index;
  }

  public switchNavigation() {
    this.navigationService.switchNavigation();
  }

  public nextMatrix() {
    this.matrixCollectionIndex = (this.matrixCollectionIndex + 1) % this.matrixCollection.length;
    this.matrix = this.matrixCollection[this.matrixCollectionIndex];
  }

  public previousMatrix() {
    if (this.matrixCollectionIndex == 0) {
      this.matrixCollectionIndex = this.matrixCollection.length - 1;
    } else {
      this.matrixCollectionIndex = (this.matrixCollectionIndex - 1) % this.matrixCollection.length;
    }
    this.matrix = this.matrixCollection[this.matrixCollectionIndex];
  }

  public switchAllExpanded() {
    this.isInExpandedMode = !this.isInExpandedMode;
    for (let i = 0; i < NUMBER_OF_ROWS; i++) {
      this.matrix.rows[i].isExpanded = this.isInExpandedMode;
    }
  }

  getNonFoldedRows() {
    return this.matrix.rows.filter((row: Row) => {
      return !row.isFolded;
    });
  }

  switchFold() {
    if (this.isInFoldMode) {
      for (let i = 0; i < NUMBER_OF_ROWS; i++) {
        this.matrix.rows[i].isFolded = false;
      }
      this.isInFoldMode = false;
    } else {
      for (let i = 0; i < NUMBER_OF_ROWS; i++) {
        this.matrix.rows[i].isFolded = true;
        for (let y = 0; y < NUMBER_OF_COLUMNS; y++) {
          if (this.matrix.rows[i].buttons[y].isActive) {
            this.matrix.rows[i].isFolded = false;
          }
        }
      }
      this.isInFoldMode = true;
    }
  }

  public clearMatrix() {
    for (let i = 0; i < NUMBER_OF_ROWS; i++) {
      for (let y = 0; y < NUMBER_OF_COLUMNS; y++) {
        this.matrix.rows[i].buttons[y].isActive = false;
      }
    }
  }

  private createKickRow(): Row {
    const rowArray: RowButton[] = [];

    for (let y = 0; y < NUMBER_OF_COLUMNS; y++) {
      const kickButton = new RowButton();
      kickButton.setOSCMessage({
        address: '/drums/kick',
        args: [],
        info: {
          address: '/play_note',
          family: 'IPv4',
          port: 80,
          size: 1,
        }
      });
      rowArray.push(kickButton);
    }

    return new Row(rowArray, 'Kick');
  }

  private createSnareRow(): Row {
    const rowArray: RowButton[] = [];

    for (let y = 0; y < NUMBER_OF_COLUMNS; y++) {
      const kickButton = new RowButton();
      kickButton.setOSCMessage({
        address: '/drums/snare',
        args: [],
        info: {
          address: '/play_note',
          family: 'IPv4',
          port: 80,
          size: 1,
        }
      });
      rowArray.push(kickButton);
    }

    return new Row(rowArray, 'Snare');
  }

  private createHihatRow(): Row {
    const rowArray: RowButton[] = [];

    for (let y = 0; y < NUMBER_OF_COLUMNS; y++) {
      // kick
      const kickButton = new RowButton();
      kickButton.setOSCMessage({
        address: '/drums/hihat',
        args: [],
        info: {
          address: '/play_note',
          family: 'IPv4',
          port: 80,
          size: 1,
        }
      });
      rowArray.push(kickButton);
    }

    return new Row(rowArray, 'Hihat');
  }

  private createMatrixDrums() {
    const matrix: Matrix = new Matrix();
    matrix.rows.push(this.createKickRow());
    matrix.rows.push(this.createHihatRow());
    matrix.rows.push(this.createSnareRow());
    matrix.name = 'Drums';
    this.matrixCollection.push(matrix);
  }

  private createMatrixPiano() {
    const matrix: Matrix = new Matrix();
    for (let i = 0; i < NUMBER_OF_ROWS; i++) {
      const rowArray: RowButton[] = [];

      const randomNote = NOTES_MAJOR_C[i % 7];
      const note = randomNote + (Math.floor(i / 7));

      for (let y = 0; y < NUMBER_OF_COLUMNS; y++) {
        const button = new RowButton(note);
        rowArray.push(button);
      }

      const row: Row = new Row(rowArray);
      row.name = note;

      matrix.rows.push(row);
    }
    matrix.name = 'Synth';
    this.matrixCollection.push(matrix);
  }

  public stop() {
    if (this.playSubscription) {
      this.playSubscription.unsubscribe();

      for (const rows of this.matrix.rows) {
        const oldButton: RowButton = rows.buttons[this.temp];
        oldButton.isPlayed = false;
      }

      this.temp = 0;
    }
  }

  public updateMatrix() {
    this.subject.next(this.msPerBeat);
  }

  public start() {
    for (const rows of this.matrix.rows) {
      const oldButton: RowButton = rows.buttons[0];
      oldButton.isPlayed = true;

      if (oldButton.isActive) {
        this.socketService.send(Action.REDIRECT_OSC_MESSAGE, oldButton.oscMessage);
      }
    }

    this.playSubscription = this.interval.subscribe(_ => {
      const newTemp = (this.temp + 1) % NUMBER_OF_COLUMNS;

      for (const rows of this.matrix.rows) {
        const oldButton: RowButton = rows.buttons[this.temp];
        oldButton.isPlayed = false;

        const newButton: RowButton = rows.buttons[(this.temp + 1) % NUMBER_OF_COLUMNS];
        newButton.isPlayed = true;

        if (newButton.isActive) {
          this.socketService.send(Action.REDIRECT_OSC_MESSAGE, newButton.oscMessage);
        }
      }
      this.temp = newTemp;
    });

    this.subject.next(this.msPerBeat);
  }

  public switch(event, rowButton: RowButton) {
    if (event.srcElement.nodeName.toLowerCase() == 'mat-slider' || this.clicked) {
      this.clicked = false;
    } else {
      rowButton.isActive = !rowButton.isActive;
    }
  }

  onLongPress(event, button) {
    event.preventDefault();

    if (button.isActive) {
      this.contextMenuPosition.x = event.pageX + 'px';
      this.contextMenuPosition.y = event.pageY + 'px';
      this.contextMenu.menuData = {button};
      this.contextMenu.openMenu();
    }
  }

  onContextMenu(event: MouseEvent, button: RowButton) {
    event.preventDefault();

    if (button.isActive) {
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { button };
      this.contextMenu.openMenu();
    }
  }

  public increaseVelocity(event: MouseEvent, button: RowButton) {
    event.stopPropagation();
    button.velocity += 10;
    console.log(button.velocity);
  }

  public decreaseVelocity(event: MouseEvent, button: RowButton) {
    event.stopPropagation();
    button.velocity -= 10;
    console.log(button.velocity);
  }

  public clickedSlider() {
    this.clicked = true;
  }

}
