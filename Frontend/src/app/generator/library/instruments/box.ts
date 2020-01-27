import { Cents, Note, Velocity } from '../types';
import { FMSynth, Frequency, Gain, Synth } from 'tone';
import { Logger } from '@upe/logger';
import { IMCPInstrument, MCPInstrumentName } from '../mcp-instrument';
import { DefaultMap } from '../defaultMap';
import { convertMonoToStereo } from '../utils';

export class Box implements IMCPInstrument {

  private readonly logger: Logger = new Logger({ name: 'Box Instrument', flags: ['music'] });

  private voices: DefaultMap<Note, FMSynth | Synth> = new DefaultMap(() => this.createSynthVoice());
  private readonly output = new Gain();

  private pitchShift = 0;

  constructor(public readonly name: MCPInstrumentName = "Box") {
    this.setSynthVoices();
  }

  private static frequencyFromNote(note: Note): number {
    return Frequency(note).toFrequency();
  }

  private static addPitchShift(note: Note, cents: number): number {
    const baseFrequency = Box.frequencyFromNote(note);
    const frequencyChange = baseFrequency * (2 * cents / 1200);
    return baseFrequency + frequencyChange;
  }

  public setSynthVoices() {
    const oldVoices = this.voices;
    this.voices = new DefaultMap(() => this.createSynthVoice());
    oldVoices.forEach((voice, note) => {
      voice.triggerRelease();
    });
  }

  public setKalimbaVoices() {
    const oldVoices = this.voices;
    this.voices = new DefaultMap(() => this.createKalimbaVoice());
    oldVoices.forEach((voice, note) => {
      voice.triggerRelease();
    });
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

  public release(note: Note) {
    this.logger.info(`Release with note ${note}.`);
    const voice = this.voices.get(note);
    voice.triggerRelease();
  }

  public setVolume(loudness: number) {
    this.logger.info(`Set volume with loudness ${loudness}.`);
    this.output.gain.value = loudness;
  }

  private createSynthVoice(): Synth {
    return new Synth({
      detune: this.pitchShift,
      portamento: 0.04,
      envelope: {
        attack: 0.19,
        attackCurve: "step",
        decay: 0.21,
        decayCurve: "linear",
        sustain: 0.3,
        release: 0.1,
        releaseCurve: "linear",
      },
      oscillator: {
        type: "custom" as any,
        partials: [1, 0.5]
      }
    }).connect(this.output);
  }

  private createKalimbaVoice(): FMSynth {
    return new FMSynth({
      "harmonicity": 8,
      "modulationIndex": 2,
      "oscillator" : {
        "type": "sine"
      },
      "envelope": {
        "attack": 0.001,
        "decay": 2,
        "sustain": 0.1,
        "release": 2
      },
      "modulation" : {
        "type" : "square"
      },
      "modulationEnvelope" : {
        "attack": 0.002,
        "decay": 0.2,
        "sustain": 0,
        "release": 0.2
      }
    }).connect(this.output);
  }

  public getAudioNode() {
    return convertMonoToStereo(this.output);
  }

}
