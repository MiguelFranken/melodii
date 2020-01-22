import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class MatStateService {

  private isInChordMode = false;
  private editMode = false;

  public octave = "3";
  public scale = 'major';
  public rootNote = 'C';

  public getIsInChordMode(): boolean {
    return this.isInChordMode;
  }

  public setIsInChordMode(value: boolean) {
    this.isInChordMode = value;
  }

  public getIsInEditMode(): boolean {
    return this.editMode;
  }

  public setIsInEditMode(value: boolean) {
    this.editMode = value;
  }

  public setCurrentOctave(octave) {
    this.octave = octave;
  }

  public getCurrentOctave() {
    return this.octave;
  }

  public getCurrentScale() {
    return this.scale;
  }

  public setCurrentScale(value) {
    this.scale = value;
  }

  public getCurrentRootNote() {
    return this.rootNote;
  }

  public setCurrentRootNote(value) {
    this.rootNote = value;
  }

}
