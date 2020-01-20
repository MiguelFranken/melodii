import { LoggerController } from "./logger";
import { PlayNoteController } from "./playnote";
import { DrumsController } from './drums';
import { PianoController } from './piano';
import { MatController } from './mat';
import { BoxController } from './box';
import { ArcController } from './arc';
import { EffectsController } from './effects';
import { LatencyController } from './latency';
import { VolumeController } from "./volume";

// add your controllers here
// controllers get registered automatically
export const CONTROLLERS = [
  LoggerController,
  PlayNoteController,
  DrumsController,
  PianoController,
  MatController,
  BoxController,
  ArcController,
  EffectsController,
  LatencyController,
  VolumeController
];
