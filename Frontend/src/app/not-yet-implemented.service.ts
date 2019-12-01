import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class NotYetImplementedService {

  constructor(private _snackBar: MatSnackBar) { }

  openSnackbar() {
    this._snackBar.open('This has not yet been implemented!', null, {
      duration: 2500,
    });
  }

}
