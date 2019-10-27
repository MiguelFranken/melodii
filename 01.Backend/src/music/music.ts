import { Note, Interval, Distance, Scale, Chord } from "tonal";
import { BehaviorSubject, Observable } from "rxjs";
import { OSCMessage } from "../osc/osc-message";
import { IOSCArgs } from "../osc/osc-types";

// TODO MF: better name
export interface IMusic {
  playNote(note?: string): void;
}

export class Music implements IMusic {

  private msgSubject = new BehaviorSubject<OSCMessage>(new OSCMessage("", [])); // TODO MF: better initial osc message
  private readonly scale: string[];

  constructor() {
    this.scale = Scale.notes("Db major");
    console.log(this.scale);
  }

  /**
   * Emits the music event to sonic pi or somewhere else
   * @param message
   */
  private emit(message: OSCMessage) {
    this.msgSubject.next(message);
  }

  public getMusicObservable(): Observable<OSCMessage> {
    return this.msgSubject.asObservable();
  }

  /**
   * Plays a single note
   * @param note
   */
  public playNote(note: string): void {
    let noteValue = Note.midi(note) as number;

    const noteArg: IOSCArgs = {
      type: "i",
      value: noteValue,
    };
    const msg = new OSCMessage("/play/piano", [ noteArg ]);
    this.emit(msg);
  }

}
