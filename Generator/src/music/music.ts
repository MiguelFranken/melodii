import { Scale } from "tonal";
import { note } from "@tonaljs/tonal";
import * as Tone from "tone";
import { SampleLib } from './samplelib';
import DrumsSnare from './instruments/drums_snare';
import DrumsKick from './instruments/drums_kick';


export enum ChordQuality {
  MAJOR = "",
  MINOR = "m",
  DIMINISHED = "dim", // TODO MF: testen ob diminished mit sonic pi so klappt
}

export class Music {

  private static MAJOR_CHORD_QUALITIES: ChordQuality[] = [
    ChordQuality.MAJOR,
    ChordQuality.MINOR,
    ChordQuality.MINOR,
    ChordQuality.MAJOR,
    ChordQuality.MAJOR,
    ChordQuality.MINOR,
    ChordQuality.DIMINISHED,
  ];

  private instruments: {[k: string]: any} = {};
  private sampleLib = new SampleLib();
  private readonly scale: string[];
  private isEchoActivated = false;

  constructor() {
    this.scale = Scale.notes("C major");
    const drumsSnare = new DrumsSnare();
    const drumsKick = new DrumsKick();

    this.instruments.synth = new Tone.Synth().toMaster();
    this.instruments.piano = this.sampleLib.getPianoSampler(
      () => console.log("piano bufferd"), // just for debug purpose
    ).toMaster();
    this.instruments.longNote = this.sampleLib.getLongNoteSynth().toMaster();
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
  public playNote(note: string, velocity: number, volume: number): void {
    console.log(`Play sound ${note}, ${velocity}, ${volume}.`);
    const {synth} = this.instruments;
    synth.volume.value = volume;
    synth.triggerAttackRelease(note, velocity);
  }

  /**
   * Plays a single note on piano sampler
   * @param note "C4", "D2", "A2", ...
   */
  public pianoPlayNote(note: string): void {
    console.log(`Play sound ${note}.`);
    this.instruments.piano.triggerAttackRelease(note, "8n");
  }

  /**
   * Starts the attack of a single note
   * @param note "C4", "D2", "A2", ...
   */
  public startLongNote(note: string, volume: number): void {
    const {longNote} = this.instruments;
    longNote.volume.value = volume;
    longNote.triggerAttack(note);
  }

  /**
   * Releases the holded single note
   * @param note "C4", "D2", "A2", ...
   */
  public stopLongNote(): void {
    this.instruments.longNote.triggerRelease();
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
    return Music.MAJOR_CHORD_QUALITIES[index] as ChordQuality;
  }

}
