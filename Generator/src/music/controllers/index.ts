// add your controllers here
// controllers get registered automatically
import { LoggerController } from "./logger";
import { PlayNoteController } from "./playnote";
import { DrumsController } from './drums';
import { PianoController } from './piano';
import { BoxController } from './box';

export const CONTROLLERS = [
  LoggerController,
  PlayNoteController,
  DrumsController,
  PianoController,
  BoxController
];