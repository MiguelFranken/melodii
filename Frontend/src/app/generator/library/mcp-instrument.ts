import { Instrument } from 'tone/build/esm/instrument/Instrument';
import { Polyphonizer } from './polyphonizer';
import { ToneAudioNode } from 'tone';

export type MCPInstrumentName = string;

export interface IMCPInstrument {
  name: MCPInstrumentName;
  getAudioNode(): ToneAudioNode; // TODO MF: Lösung für den Polyphonizer notwendig!
}
