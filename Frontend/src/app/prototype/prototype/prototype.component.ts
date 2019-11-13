import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from "rxjs";

export class RowButton {
  public isPlayed: boolean = false;
  public isActive: boolean = false;

  constructor(public id: string) {
  }
}

const NUMBER_OF_COLUMNS: number = 8;

@Component({
  selector: 'app-prototype',
  templateUrl: './prototype.component.html',
  styleUrls: ['./prototype.component.scss']
})
export class PrototypeComponent implements OnInit {

  public temp: number = 0;

  private playSubscription: Subscription;

  public matrix = [
    [
      new RowButton("i00"),
      new RowButton("i01"),
      new RowButton("id02"),
      new RowButton("id03"),
      new RowButton("id04"),
      new RowButton("id05"),
      new RowButton("id06"),
      new RowButton("id07"),
    ],
    [
      new RowButton("i00"),
      new RowButton("i01"),
      new RowButton("id02"),
      new RowButton("id03"),
      new RowButton("id04"),
      new RowButton("id05"),
      new RowButton("id06"),
      new RowButton("id07"),
    ],
    [
      new RowButton("i00"),
      new RowButton("i01"),
      new RowButton("id02"),
      new RowButton("id03"),
      new RowButton("id04"),
      new RowButton("id05"),
      new RowButton("id06"),
      new RowButton("id07"),
    ],
    [
      new RowButton("i00"),
      new RowButton("i01"),
      new RowButton("id02"),
      new RowButton("id03"),
      new RowButton("id04"),
      new RowButton("id05"),
      new RowButton("id06"),
      new RowButton("id07"),
    ],
  ];

  constructor() { }

  ngOnInit() {
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
    }

    this.playSubscription = interval(1000).subscribe(_ => {
      const newTemp = (this.temp + 1) % NUMBER_OF_COLUMNS;

      for (let rows of this.matrix) {
        const oldButton: RowButton = rows[this.temp];
        oldButton.isPlayed = false;

        const newButton: RowButton = rows[(this.temp+1) % NUMBER_OF_COLUMNS];
        newButton.isPlayed = true;
      }
      this.temp = newTemp;
    })
  }

  public switch(row: number, column: number) {
    this.matrix[row][column].isActive = !this.matrix[row][column].isActive;
  }

}
