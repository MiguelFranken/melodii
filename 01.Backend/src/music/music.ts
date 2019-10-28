import { Note, Interval, Distance, Scale, Chord } from "tonal";
import { BehaviorSubject, Observable } from "rxjs";
import { OSCMessage } from "../osc/osc-message";
import { IOSCArgs } from "../osc/osc-types";

// TODO MF: better name
export interface IMusic {
  playNote(note?: string): void;
  switchEchoEffect(): void;
}

export class Music implements IMusic {

  private msgSubject = new BehaviorSubject<OSCMessage>(new OSCMessage("", [])); // TODO MF: better initial osc message
  private readonly scale: string[];
  private isEchoActivated = false;

  constructor() {
    this.scale = Scale.notes("C major");
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

  public switchEchoEffect(): void {
    this.isEchoActivated = !this.isEchoActivated;
  }

  /**
   * Plays a single note
   * @param note "C4", "D2", "A2", ...
   */
  public playNote(note: string): void {
    let noteValue = Note.midi(note) as number;

    const noteArg: IOSCArgs = {
      type: "i",
      value: noteValue,
    };
    const echoArg: IOSCArgs = {
      type: "i",
      value: Number(this.isEchoActivated),
    };

    const msg = new OSCMessage("/play/piano", [ noteArg, echoArg ]);
    this.emit(msg);
  }

}
