// add your controllers here
// controllers get registered automatically
import { LoggerController } from "./logger";
import { PlayNoteController } from "./playnote";

export const CONTROLLERS = [
  LoggerController,
  PlayNoteController,
];
