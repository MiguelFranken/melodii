import { Note, Interval, Distance, Scale, Chord } from "tonal";
import { note } from "@tonaljs/tonal";
import { BehaviorSubject, Observable } from "rxjs";
import { OSCMessage } from "../osc/osc-message";
import { IOSCArgs } from "../osc/osc-types";

export enum ChordQuality {
  MAJOR = "",
  MINOR = "m",
  DIMINISHED = "dim", // TODO MF: testen ob diminished mit sonic pi so klappt
}

// TODO MF: better name
export interface IMusic {
  playNote(note?: string): void;
  switchEchoEffect(): void;
}

export class Music implements IMusic {

  private static MajorChordQualities: ChordQuality[] = [
    ChordQuality.MAJOR,
    ChordQuality.MINOR,
    ChordQuality.MINOR,
    ChordQuality.MAJOR,
    ChordQuality.MAJOR,
    ChordQuality.MINOR,
    ChordQuality.DIMINISHED
  ];

  private msgSubject = new BehaviorSubject<OSCMessage>(new OSCMessage("", [])); // TODO MF: better initial osc message
  private readonly scale: string[];
  private isEchoActivated = false;

  constructor() {
    this.scale = Scale.notes("C major");
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
   * Activates the echo effect if it was not activated yet and
   * deactivates the echo effect if it was already activated.
   */
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

  /**
   * Given a particular scale, this method first calculates the position of the specified
   * note in the scale, and then returns the chord quality of the triad that can
   * be built with the specified note in the given scale.
   * See http://www2.siba.fi/muste1/index.php?id=76&la=en
   * @param forNote
   * @param inScale
   * @constructor
   */
  private static GetChordQuality(forNote: string, inScale: string[]): ChordQuality {
    // TODO MF: Im Moment gehen wir immer von Major aus. Das ist falsch! Aus dem type string[] für
    //          eine Scale sollte sowas wie Scale werden. Dort sollten alle Noten abgespeichert werden,
    //          aber auch andere Metadata wie der Name des Modes (Major, Minor, ...). Diese Information ist
    //          hier notwendig um die richtige ChordQuality zu bestimmen!
    const index: number = inScale.indexOf(note(forNote).letter as string);
    return Music.MajorChordQualities[index] as ChordQuality;
  }

  public playChord(root: string, chordQuality?: ChordQuality) {
    let rootNoteValue = Note.midi(root) as number;

    const rootNoteArg: IOSCArgs = {
      type: "i",
      value: rootNoteValue,
    };
    const modeNoteArg: IOSCArgs = {
      type: "s",
      value: chordQuality ? chordQuality : Music.GetChordQuality(root, this.scale),
    };
    const echoArg: IOSCArgs = {
      type: "i",
      value: Number(this.isEchoActivated),
    };

    const msg = new OSCMessage("/play/chord", [ rootNoteArg, modeNoteArg, echoArg ]);
    this.emit(msg);
  }

}
