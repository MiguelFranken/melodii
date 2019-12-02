import { LoggerController } from "./logger";
import { PlayNoteController } from "./playnote";
import { DrumsController } from './drums';
import { PianoController } from './piano';
import { BoxController } from './box';
import { ArcController } from './arc';
import { EffectsController } from './effects';

// add your controllers here
// controllers get registered automatically
export const CONTROLLERS = [
  LoggerController,
  PlayNoteController,
  DrumsController,
  PianoController,
  BoxController,
  ArcController,
  EffectsController
];
