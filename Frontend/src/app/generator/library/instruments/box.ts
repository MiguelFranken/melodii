import { Cents, Note, Velocity } from '../types';
import { Frequency, Gain, Synth } from 'tone';
import { Logger } from '@upe/logger';
import { IMCPInstrument, MCPInstrumentName } from '../mcp-instrument';
import { DefaultMap } from '../defaultMap';

export class Box implements IMCPInstrument {

  private readonly voices: DefaultMap<Note, Synth> = new DefaultMap(() => this.createVoice());
  private readonly output = new Gain();

  private pitchShift = 0;

  private readonly logger: Logger = new Logger({ name: 'Box Instrument', flags: ['music'] });

  constructor(public readonly name: MCPInstrumentName = "Box") {
  }

  public trigger(note: Note, velocity: Velocity) {
    this.logger.info(`Trigger with note ${note} and velocity ${velocity}.`);
    const voice = this.voices.get(note);
    const frequency = Box.addPitchShift(note, this.pitchShift);
    voice.triggerAttack(frequency, undefined, velocity);
  }

  public detune(cents: Cents) {
    this.logger.info(`Detune with cents ${cents}.`);
    this.pitchShift = cents;
    this.voices.forEach((voice, note) => {
      const frequency = Box.addPitchShift(note, this.pitchShift);
      voice.setNote(frequency);
    });
  }

  private static frequencyFromNote(note: Note): number {
    return Frequency(note).toFrequency();
  }

  private static addPitchShift(note: Note, cents: number): number {
    const baseFrequency = Box.frequencyFromNote(note);
    const frequencyChange = baseFrequency * (2 * cents / 1200);
    return baseFrequency + frequencyChange;
  }

  public release(note: Note) {
    this.logger.info(`Release with note ${note}.`);
    const voice = this.voices.get(note);
    voice.triggerRelease();
  }

  public setVolume(loudness: number) {
    this.logger.info(`Set volume with loudness ${loudness}.`);
    this.output.gain.value = loudness;
  }

  private createVoice(): Synth {
    return new Synth({ detune: this.pitchShift }).connect(this.output);
  }

  public getAudioNode() {
    return convertMonoToStereo(this.output);
  }
}
