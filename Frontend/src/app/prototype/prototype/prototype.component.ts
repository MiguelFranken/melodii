import { Component, OnInit } from '@angular/core';
import { interval, Subject, Subscription } from "rxjs";
import { SocketService } from "../../shared/socket/socket.service";
import { Action } from "../../shared/socket/action";
import { IOSCMessage } from "../../shared/osc/osc-message";
import { switchMap } from "rxjs/operators";

const NOTES_PENTATONIC_C = [
  "C",
  "D",
  "E",
  "A",
  "G"
];

const DEFAULT_BPM = 80;

export class Row {
  public isExpanded = true;
  public name: string = "row name";

  constructor(public buttons: RowButton[]) {
  }
}

export class RowButton {
  public isPlayed: boolean = false;
  public isActive: boolean = false;
  public id: string;

  public oscMessage: IOSCMessage;

  constructor(note: string) {
    this.id = note;
    this.setOSCMessage(note);
  }

  private setOSCMessage(note) {
    this.oscMessage = {
      address: "/play_note",
        args: [
      { type: "s", value: note }
    ],
      info: {
      address: "/play_note",
        family: "IPv4",
        port: 80,
        size: 1,
    }
    }
  }
}

const NUMBER_OF_COLUMNS: number = 8;
const NUMBER_OF_ROWS: number = 6;

@Component({
  selector: 'app-prototype',
  templateUrl: './prototype.component.html',
  styleUrls: ['./prototype.component.scss']
})
export class PrototypeComponent implements OnInit {

  public switchRow(rowIndex: number) {
    this.matrix[rowIndex].isExpanded = !this.matrix[rowIndex].isExpanded;
  }

  private _bpm: number = DEFAULT_BPM;

  public set bpm(bpm: number) {
    this._bpm = bpm;
    this.msPerBeat = 1000 * 0.5 * (60 / bpm);
  }

  public get bpm(): number {
    return this._bpm
  }

  private subject = new Subject();
  private _interval;

  private msPerBeat: number = 1000 * 0.5 * (60 / DEFAULT_BPM); // TODO MF: different default

  public temp: number = 0;

  private playSubscription: Subscription;

  public showRowNames: boolean = true;

  public matrix: Row[] = [];

  constructor(private socketService: SocketService) { }

  changeBpm(event) {
    this.bpm = event.value;
  }

  ngOnInit() {
    this._interval = this.subject.pipe(switchMap((period: number) => interval(period)));
    this.socketService.initSocket();
    this.createMatrix();
  }

  public switchShowRowNames() {
    this.showRowNames = !this.showRowNames;
  }

  private createMatrix() {
    for (let i = 0; i < NUMBER_OF_ROWS; i++) {
      let rowArray: RowButton[] = [];

      for (let y = 0; y < NUMBER_OF_COLUMNS; y++) {
        const randomNote = NOTES_PENTATONIC_C[Math.floor(Math.random() * NOTES_PENTATONIC_C.length)];
        const note = randomNote + (i+1);
        const button = new RowButton(note);
        rowArray.push(button);
      }

      const row: Row = new Row(rowArray);

      this.matrix.push(row);
    }
  }

  public stop() {
    if (this.playSubscription) {
      this.playSubscription.unsubscribe();

      for (let rows of this.matrix) {
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
    for (let rows of this.matrix) {
      const oldButton: RowButton = rows.buttons[0];
      oldButton.isPlayed = true;

      if (oldButton.isActive) {
        this.socketService.send(Action.SEND_OSC_MESSAGE, oldButton.oscMessage);
      }
    }

    this.playSubscription = this._interval.subscribe(_ => {
      const newTemp = (this.temp + 1) % NUMBER_OF_COLUMNS;

      for (let rows of this.matrix) {
        const oldButton: RowButton = rows.buttons[this.temp];
        oldButton.isPlayed = false;

        const newButton: RowButton = rows.buttons[(this.temp+1) % NUMBER_OF_COLUMNS];
        newButton.isPlayed = true;

        if (newButton.isActive) {
          this.socketService.send(Action.SEND_OSC_MESSAGE, newButton.oscMessage);
        }
      }
      this.temp = newTemp;
    });

    this.subject.next(this.msPerBeat);
  }

  public switch(row: number, column: number) {
    this.matrix[row].buttons[column].isActive = !this.matrix[row].buttons[column].isActive;
  }

}
