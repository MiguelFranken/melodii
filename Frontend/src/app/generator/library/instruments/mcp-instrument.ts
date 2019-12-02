import { Instrument } from 'tone/build/esm/instrument/Instrument';

export type MCPInstrumentName = string;

export interface IMCPInstrument {
  name: MCPInstrumentName;
  getInstrument(): Instrument<any>;
}
