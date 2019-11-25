import { LoggerController } from "./logger";
import { PlayNoteController } from "./playnote";
import { DrumsController } from './drums';
import { PianoController } from './piano';

// add your controllers here
// controllers get registered automatically
export const CONTROLLERS = [
  LoggerController,
  PlayNoteController,
  DrumsController,
  PianoController,
];
