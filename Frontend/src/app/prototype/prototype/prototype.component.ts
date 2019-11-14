import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from "rxjs";
import { SocketService } from "../../shared/socket/socket.service";
import { Action } from "../../shared/socket/action";
import { IOSCMessage } from "../../shared/osc/osc-message";

const NOTES_PENTATONIC_C = [
  "C",
  "D",
  "E",
  "A",
  "G"
];

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
const NUMBER_OF_ROWS: number = 4;

@Component({
  selector: 'app-prototype',
  templateUrl: './prototype.component.html',
  styleUrls: ['./prototype.component.scss']
})
export class PrototypeComponent implements OnInit {

  public temp: number = 0;

  private playSubscription: Subscription;

  public matrix = [];

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    this.socketService.initSocket();
    this.createMatrix();
  }

  private createMatrix() {
    for (let i = 0; i < NUMBER_OF_ROWS; i++) {
      let row: RowButton[] = [];

      for (let y = 0; y < NUMBER_OF_COLUMNS; y++) {
        const randomNote = NOTES_PENTATONIC_C[Math.floor(Math.random() * NOTES_PENTATONIC_C.length)];
        const note = randomNote + (i+1);
        const button = new RowButton(note);
        row.push(button);
      }

      this.matrix.push(row);
    }
  }

  public stop() {
    if (this.playSubscription) {
      this.playSubscription.unsubscribe();

      for (let rows of this.matrix) {
        const oldButton: RowButton = rows[this.temp];
        oldButton.isPlayed = false;
      }

      this.temp = 0;
    }
  }

  public start() {
    for (let rows of this.matrix) {
      const oldButton: RowButton = rows[0];
      oldButton.isPlayed = true;

      if (oldButton.isActive) {
        this.socketService.send(Action.SEND_OSC_MESSAGE, oldButton.oscMessage);
      }
    }

    this.playSubscription = interval(1000).subscribe(_ => {
      const newTemp = (this.temp + 1) % NUMBER_OF_COLUMNS;

      for (let rows of this.matrix) {
        const oldButton: RowButton = rows[this.temp];
        oldButton.isPlayed = false;

        const newButton: RowButton = rows[(this.temp+1) % NUMBER_OF_COLUMNS];
        newButton.isPlayed = true;

        if (newButton.isActive) {
          this.socketService.send(Action.SEND_OSC_MESSAGE, newButton.oscMessage);
        }
      }
      this.temp = newTemp;
    })
  }

  public switch(row: number, column: number) {
    this.matrix[row][column].isActive = !this.matrix[row][column].isActive;
  }

}
