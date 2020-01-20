import { IOSCArg, OSCTypeTag } from './osc/osc-types';
import { OSCError } from './error';
import { Cents, Duration, Note, Velocity } from './types';
import { Octave, ScaleName } from './instruments/mat';

export class TypeChecker {

  private static Regex = {
    Note: /^[A-G][b#]?[0-9]$/,
    NoteWithoutOctave: /^[A-G][b#]?$/,
    NormalRange: /^1$|^0$|^0.[0-9]+$/,
    Duration: /^$/,
    Cents: /^$/,
    Effectbool: /^0$|^1$/,
  };

  constructor() {
  }

  public static ValidNoteArg(arg: IOSCArg) {
    const { type, value } = arg;
    const parsed = String(value);
    if (type !== "s") {
      throw new OSCError("MCPx0000", "Note has invalid type. Expected string type, i.e. 's'.");
    } else if (!parsed.match(TypeChecker.Regex.Note)) {
      throw new OSCError("MCPx0001", "Note has invalid value");
    }
    return parsed;
  }

  public static ValidNoteWithoutOctaveArg(arg: IOSCArg) {
    const { type, value } = arg;
    const parsed = String(value);
    if (type !== "s") {
      throw new OSCError("MCPx0000", "Note has invalid type. Expected string type, i.e. 's'.");
    } else if (!parsed.match(TypeChecker.Regex.NoteWithoutOctave)) {
      throw new OSCError("MCPx0001", "Note has invalid value");
    }
    return parsed;
  }

  public static ValidScaleArg(arg: IOSCArg) {
    const { type, value } = arg;
    const parsed = String(value);
    if (type !== "s") {
      throw new OSCError("MCPx0000", "Argument has invalid type. Expected string type, i.e. 's'.");
    } else if (value !== "major" && value !== "minor") {
      throw new OSCError("MCPx0001", "Argument value must be 'major' or 'minor'");
    }
    return parsed as ScaleName;
  }

  public static ValidNormalRangeArg(arg: IOSCArg) {
    const { type, value } = arg;
    const parsed = parseFloat(value.toString());
    if (type !== "f") {
      throw new OSCError("MCPx0002", "Velocity has invalid type. Expected float type, i.e. 'f'.", arg);
    } else if (!String(parsed).match(TypeChecker.Regex.NormalRange)) {
      throw new OSCError("MCPx0003", "Velocity value is not in normal range ([0,1])", arg);
    } else if (isNaN(parsed)) {
      throw new OSCError("MCPx0004", "Velocity value matches not the right type", arg);
    }
    return parsed;
  }

  public static ValidFloatArg(arg: IOSCArg) {
    const { type, value } = arg;
    const parsed = parseFloat(value.toString());
    if (type !== "f") {
      throw new OSCError("MCPx0202", "Velocity has invalid type. Expected float type, i.e. 'f'.", arg);
    } else if (isNaN(parsed)) {
      throw new OSCError("MCPx0204", "Velocity value matches not the right type", arg);
    }
    return parsed;
  }

  public static ValidDurationArg(arg: IOSCArg) {
    const { type, value } = arg;
    if (type !== "s") {
      throw new OSCError("MCPx0005", "Duration has invalid type. Expected string type, i.e. 's'.", arg);
    }
    // TODO
    return value;
  }

  public static ValidEffectBoolArg(arg: IOSCArg): boolean {
    const { type, value } = arg;
    const parsed = Number(value);
    if (type !== "i") {
      throw new OSCError("MCPx0007", "EffectBoolArg has invalid type. Expected integer type, i.e. 'i'.", arg);
    } else if (isNaN(parsed)) {
      throw new OSCError("MCPx0008", "EffectBoolArg value is not an integer", arg);
    } else if (parsed < 0 || parsed > 1) {
      throw new OSCError("MCPx0009", "EffectBoolArg value is not an integer between [0,1]", arg);
    }
    return !!parsed;
  }

  public static ValidIndexArg(size: number, arg: IOSCArg) {
    const { type, value } = arg;
    if (type !== "i") {
      throw new OSCError("MCPx000A", "Index has invalid type. Expected integer type, i. e. 'i'.", arg);
    } else if (!Number.isInteger(value as number)) {
      throw new OSCError("MCPx000B", "Index value is not an integer", arg);
    }

    const index = value as number;
    if (index >= size) {
      throw new OSCError("MCPx000C", `Index value out of bounds. It cannot be greater than ${size}.`, arg);
    }

    return index;
  }

  public static ValidOctaveArg(arg: IOSCArg): Octave {
    const { type, value } = arg;
    if (type !== "i") {
      throw new OSCError("MCPx000A", "Index has invalid type. Expected integer type, i. e. 'i'.", arg);
    } else if (!Number.isInteger(value as number)) {
      throw new OSCError("MCPx000B", "Index value is not an integer", arg);
    }

    const index = value as number;
    if (index > 5 || index < 1) {
      throw new OSCError("MCPx000C", `Index value out of bounds. It must be between 1 and 5.`, arg);
    }

    return index as Octave;
  }

  public static ValidCentsArg(arg: IOSCArg) {
    const { type, value } = arg;
    if (type !== "i") {
      throw new OSCError("MCPx000D", "Cents has invalid type. Expected integer type, i. e. 'i'.", arg);
    } else if (!Number.isInteger(value as number)) {
      throw new OSCError("MCPx000E", "Cents value is not an integer", arg);
    }

    return Number(value);
  }

}
