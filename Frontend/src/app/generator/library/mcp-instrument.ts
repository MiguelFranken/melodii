import { Instrument } from 'tone/build/esm/instrument/Instrument';
import { Polyphonizer } from './polyphonizer';

export type MCPInstrumentName = string;

export interface IMCPInstrument {
  name: MCPInstrumentName;
  getInstrument(): Instrument<any> | Polyphonizer<any>; // TODO MF: Polyphonizer sollte von Instrument erben!
}
