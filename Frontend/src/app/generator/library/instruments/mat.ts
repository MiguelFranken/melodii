import { Note, Velocity, Cents } from '../types';
import { Synth, Frequency, Gain } from 'tone';
import { Logger } from '@upe/logger';
import { IMCPInstrument, MCPInstrumentName } from '../mcp-instrument';
import { DefaultMap } from '../defaultMap';
import deprecated from 'deprecated-decorator';
import { Chord, Scale } from 'tonal';
import { convertMonoToStereo } from "../utils";

enum ChordQuality {
  major,
  minor,
  diminished
}

export type ButtonIndex = number;
export type Octave = 1 | 2 | 3 | 4 | 5;
export type ScaleName = "major" | "minor";
export type Degree = "I" | "II" | "III" | "IV" | "V" | "VI" | "VII";

export class Mat implements IMCPInstrument {

  private octave: Octave = 3;

  private rootNote = "C";

  private scale: ScaleName = 'major';

  public notes: Note[] = [];
  public degrees: Degree[] = [];

  private mapping = [0, 1, 2, 3, 4, 5, 6, 7];

  public isInChordMode = false;

  private readonly voices = new DefaultMap(() => this.createVoice());
  private readonly output = new Gain();

  private readonly logger: Logger = new Logger({ name: 'Mat Instrument', flags: ['music'] });

  constructor(public readonly name: MCPInstrumentName = "Mat") {
    this.setNotes();
    this.degrees = [
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "I"
    ];
  }

  /**
   * Requires `noteIndex` to be in bounds of this.notes.
   */
  @deprecated()
  public play(buttonIndex: ButtonIndex, velocity: Velocity) {
    const note = this.notes[buttonIndex];
    this.logger.info(`Trigger with note_index ${buttonIndex} (${note}) and velocity ${velocity}.`);
    const voice = this.voices.get(note);
    voice.triggerAttackRelease(note, "8n", undefined, velocity);
  }

  public trigger(buttonIndex: ButtonIndex, velocity: Velocity) {
    const note = this.notes[buttonIndex];

    if (this.isInChordMode) {
      const chordNotes: Note[] = this.getChord(buttonIndex);
      chordNotes.forEach((note) => {
        const voice = this.voices.get(note);
        voice.triggerAttack(note, undefined, velocity);
      });
      this.logger.info(`Trigger chord with root note ${note} and velocity ${velocity}. Playing chords: ${this.isInChordMode}`,
        { chord: chordNotes });
    } else {
      const voice = this.voices.get(note);
      voice.triggerAttack(note, undefined, velocity);
      this.logger.info(`Trigger with note ${note} and velocity ${velocity}.`);
    }
  }

  public release(buttonIndex: ButtonIndex) {
    const note = this.notes[buttonIndex];
    this.logger.info(`Release with note ${note}.`);

    if (this.isInChordMode) {
      const chordNotes: Note[] = this.getChord(buttonIndex);
      chordNotes.forEach((note) => {
        const voice = this.voices.get(note);
        voice.triggerRelease();
      });
    } else {
      const voice = this.voices.get(note);
      voice.triggerRelease();
    }
  }

  private getChord(buttonIndex: ButtonIndex): Note[] {
    const note = this.notes[buttonIndex];
    let noteSuffix = "";
    const chordQuality = this.getChordQuality(buttonIndex);
    this.logger.debug("Chord Quality", { quality: chordQuality });
    if (chordQuality === ChordQuality.minor) {
      noteSuffix = 'm';
    } else if (chordQuality === ChordQuality.diminished) {
      noteSuffix = 'dim';
    }
    return Chord.notes(note + noteSuffix);
  }

  private getChordQuality(buttonIndex: ButtonIndex): ChordQuality {
    const degree = this.degrees[buttonIndex];
    if (this.scale === 'major') {
      switch (degree) {
        case 'I':
        case 'IV':
        case 'V':
          return ChordQuality.major;
        case 'II':
        case 'III':
        case 'VI':
          return ChordQuality.minor;
        case 'VII':
          return ChordQuality.diminished;
      }
    } else {
      switch (degree) {
        case 'I':
        case 'IV':
        case 'V':
          return ChordQuality.minor;
        case 'III':
        case 'VI':
        case 'VII':
          return ChordQuality.major;
        case 'II':
          return ChordQuality.diminished;
      }
    }
  }

  /**
   * Requires `first` and `second` to be in bounds of this.notes.
   */
  public swapMapping(first: number, second: number) {
    const temp = this.mapping[first];
    this.mapping[first] = this.mapping[second];
    this.mapping[second] = temp;

    const tempDegree = this.degrees[first];
    this.degrees[first] = this.degrees[second];
    this.degrees[second] = tempDegree;

    this.setNotes();
  }

  public changeOctave(octave: Octave) {
    this.octave = octave;
    this.logger.info('Changed octave', octave);
    this.setNotes();
  }

  public changeScale(scale: ScaleName) {
    this.scale = scale;
    this.setNotes();
  }

  public setNotes() {
    const notes = Scale.notes(this.rootNote + this.octave, this.scale);
    notes.push(this.rootNote + (this.octave + 1));
    this.mapping.forEach((degree, index) => { // scale degree relative to the tonic
      this.notes[index] = notes[degree];
    });
    this.logger.info('Set Notes', this.notes);
  }

  public changeRootNote(note: Note) {
    this.rootNote = note;
    this.setNotes();
  }

  private createVoice(): Synth {
    return new Synth().connect(this.output);
  }

  public getAudioNode() {
    return convertMonoToStereo(this.output);
  }

}
