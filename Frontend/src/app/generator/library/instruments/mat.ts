import { Note, Velocity, Cents } from '../types';
import { Synth, Frequency, Merge } from 'tone';
import { Logger } from '@upe/logger';
import { IMCPInstrument, MCPInstrumentName } from '../mcp-instrument';
import { DefaultMap } from '../defaultMap';
import deprecated from 'deprecated-decorator';
import { Scale } from 'tonal';

export type ButtonIndex = number;
export type Octave = 1 | 2 | 3 | 4 | 5;
export type ScaleName = "major" | "minor";

export class Mat implements IMCPInstrument {

  private octave: Octave = 3;

  private rootNote = "C";

  private scale: ScaleName = 'major';

  public notes: Note[] = [];

  private mapping = [0, 1, 2, 3, 4, 5, 6, 7];

  private readonly voices = new DefaultMap(() => this.createVoice());
  private readonly output = new Merge();

  private readonly logger: Logger = new Logger({ name: 'Mat Instrument', flags: ['music'] });

  constructor(public readonly name: MCPInstrumentName = "Mat") {
    this.setNotes();
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
    this.logger.info(`Trigger with note ${note} and velocity ${velocity}.`);
    const voice = this.voices.get(note);
    voice.triggerAttack(note, undefined, velocity);
  }

  public release(buttonIndex: ButtonIndex) {
    const note = this.notes[buttonIndex];
    this.logger.info(`Release with note ${note}.`);
    const voice = this.voices.get(note);
    voice.triggerRelease();
  }

  /**
   * Requires `first` and `second` to be in bounds of this.notes.
   */
  public swapMapping(first: number, second: number) {
    const temp = this.mapping[first];
    this.mapping[first] = this.mapping[second];
    this.mapping[second] = temp;
    console.log(this.mapping);
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
    console.log(notes);
    this.mapping.forEach((degree, index) => { // scale degree relative to the tonic
      if (index === 7) {
        this.notes[7] = this.rootNote + (this.octave + 1);
      } else {
        this.notes[index] = notes[degree];
      }
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
    return this.output;
  }

}
