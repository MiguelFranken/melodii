import { Note, Velocity, Cents } from '../types';
import { Synth, Frequency, Merge } from 'tone';
import { Logger } from '@upe/logger';
import { IMCPInstrument, MCPInstrumentName } from '../mcp-instrument';
import { DefaultMap } from '../defaultMap';

export class Mat implements IMCPInstrument {

  public readonly mapping: Note[] = [
    "C4",
    "D4",
    "E4",
    "F4",
    "G4"
  ];

  private readonly voices = new DefaultMap(() => this.createVoice());
  private readonly output = new Merge();

  private readonly logger: Logger = new Logger({ name: 'Mat Instrument', flags: ['music'] });

  constructor(public readonly name: MCPInstrumentName = "Mat") {
  }

  /**
   * Requires `noteIndex` to be in bounds of this.mapping.
   */
  public play(buttonIndex: number, velocity: Velocity) {
    const note = this.mapping[buttonIndex];
    this.logger.info(`Trigger with note_index ${buttonIndex} (${note}) and velocity ${velocity}.`);
    const voice = this.voices.get(note);
    voice.triggerAttackRelease(note, "8n", undefined, velocity);
  }

  /**
   * Requires `first` and `second` to be in bounds of this.mapping.
   */
  public swapMapping(first: number, second: number) {
    const temp = this.mapping[first];
    this.mapping[first] = this.mapping[second];
    this.mapping[second] = temp;
  }

  private createVoice(): Synth {
    return new Synth().connect(this.output);
  }

  public getAudioNode() {
    return this.output;
  }
}
