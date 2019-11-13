import { Scale } from "tonal";
import { note } from "@tonaljs/tonal";
import * as Tone from "tone";

export enum ChordQuality {
  MAJOR = "",
  MINOR = "m",
  DIMINISHED = "dim", // TODO MF: testen ob diminished mit sonic pi so klappt
}

// TODO MF: better name
export interface IMusic {
  playNote(note: string): void;
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

  private synth = new Tone.Synth().toMaster();
  private readonly scale: string[];
  private isEchoActivated = false;

  constructor() {
    this.scale = Scale.notes("C major");
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
    console.log(`Play sound ${note}.`);
    this.synth.triggerAttackRelease(note, "8n");
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

}
