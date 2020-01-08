import { IOSCArg, OSCTypeTag } from './osc/osc-types';
import { OSCError } from './error';
import { Cents, Duration, Note, Velocity } from './types';

export class TypeChecker {

  private static Regex = {
    Note: /^[A-G][b#]?[0-9]$/,
    Velocity: /^1$|^0$|^0.[0-9]+$/,
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

  public static ValidVelocityArg(arg: IOSCArg) {
    const { type, value } = arg;
    const parsed = parseFloat(value.toString());
    if (type !== "f") {
      throw new OSCError("MCPx0002", "Velocity has invalid type. Expected float type, i.e. 'f'.", arg);
    } else if (!String(parsed).match(TypeChecker.Regex.Velocity)) {
      // velocity should be in normal range ([0,1])
      throw new OSCError("MCPx0003", "Velocity value is not in normal range ([0,1])", arg);
    } else if (isNaN(parsed)) {
      throw new OSCError("MCPx0004", "Velocity value matches not the right type", arg);
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

  public static ValidCentsArg(arg: IOSCArg) {
    // TODO
    // return value;
    return arg.value as number;
  }

  public static ValidEffectBoolArg(arg: IOSCArg): boolean {
    const { type, value } = arg;
    const parsed = Number(value);
    // TODO: update error code if the other functions use 0007
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

}
