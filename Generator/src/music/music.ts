import { Scale } from "tonal";
import { note } from "@tonaljs/tonal";
import * as Tone from "tone";
import { SampleLib } from './samplelib';

export enum ChordQuality {
  MAJOR = "",
  MINOR = "m",
  DIMINISHED = "dim", // TODO MF: testen ob diminished mit sonic pi so klappt
}



// TODO MF: better name
export interface IMusic {
  playNote(note: string, velocity: number, volume: number): void;
  switchEchoEffect(): void;
  pianoPlayNote(note: string): void;
  playDrums(instrument: string): void;
  startLongNote(note: string, volume:number): void;
  stopLongNote(): void;
}

export class Music implements IMusic {

  private static MajorChordQualities: ChordQuality[] = [
    ChordQuality.MAJOR,
    ChordQuality.MINOR,
    ChordQuality.MINOR,
    ChordQuality.MAJOR,
    ChordQuality.MAJOR,
    ChordQuality.MINOR,
    ChordQuality.DIMINISHED,
  ];

  private instruments :{[k:string]: any} = {};
  private sampleLib = new SampleLib();
  private readonly scale: string[];
  private isEchoActivated = false;
  
  constructor() {    
    this.scale = Scale.notes("C major");    
    this.instruments.synth = new Tone.Synth().toMaster();
    this.instruments.drum_kick = this.sampleLib.getKickSampler(
      () => console.log("drum kick bufferd") // just for debug purpose
    ).toMaster();
    this.instruments.drum_snare = this.sampleLib.getSnareSampler(
      () => console.log("drum snare bufferd") // just for debug purpose
    ).toMaster();
    this.instruments.piano = this.sampleLib.getPianoSampler(
      () => console.log("piano bufferd") // just for debug purpose
    ).toMaster();
    this.instruments.hihat = this.sampleLib.getHiHatSynth().toMaster();
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
    synth.triggerAttackRelease(note, 1, undefined, velocity);
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
   * plays the drums
   * @param instrument which part of the drums should be played
   */
  public playDrums(instrument: string): void {
    switch(instrument) {
      case 'kick': this.instruments.drum_kick.triggerAttack("C2"); break;
      case 'snare': this.instruments.drum_snare.triggerAttack("C2"); break;
      case 'hihat': this.instruments.hihat.triggerAttackRelease("8n"); break;
    }    
  }

  /**
   * Starts the attack of a single note
   * @param note "C4", "D2", "A2", ...
   */
  public startLongNote(note: string, volume:number): void {
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
    return Music.MajorChordQualities[index] as ChordQuality;
  }

}
