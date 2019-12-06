import { ToneAudioNode } from 'tone';

export type MCPInstrumentName = string;

export interface IMCPInstrument {
  name: MCPInstrumentName;
  getAudioNode(): ToneAudioNode;
}
