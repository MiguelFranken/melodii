import { IOSCArg, OSCTypeTag } from './osc/osc-types';
import { OSCError } from './error';
import { Cents, Duration, Note, Velocity } from './types';

export class TypeChecker {

  private static regex = {
    note: /^[A-G][b#]?[0-9]$/,
    velocity: /^1$|^0$|^0.[0-9]+$/,
    duration: /^$/,
    cents: /^$/,
    effectbool: /^0$|^1$/,
  };

  constructor() {
  }

  public static ValidNoteArg(arg: IOSCArg) {
    const { type, value } = arg;
    const parsed = String(value);
    if (type !== "s") {
      throw new OSCError("MCPx0000", "Note has invalid type");
    } else if (!parsed.match(TypeChecker.regex.note)) {
      throw new OSCError("MCPx0001", "Note has invalid value");
    }
    return parsed;
  }

  public static ValidVelocityArg(arg: IOSCArg) {
    const { type, value } = arg;
    const parsed = parseFloat(value.toString());
    if (type !== "f") {
      throw new OSCError("MCPx0002", "Velocity has invalid type", arg);
    } else if (!String(parsed).match(TypeChecker.regex.velocity)) {
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
      throw new OSCError("MCPx0005", "Duration has invalid type", arg);
    }
    // TODO
    return value;
  }

  public static ValidCentsArg(arg: IOSCArg) {

    // return value;
    return arg.value as number;
  }

  public static ValidEffectBoolArg(arg: IOSCArg): boolean {
    const { type, value } = arg;
    const parsed = String(value);
    // TODO: update error code if the other functions use 0007
    if (type !== "i") {
      throw new OSCError("MCPx0007", "EffectBoolArg has invalid type", arg);
    } else if (parsed.match(TypeChecker.regex.effectbool)) {
      throw new OSCError("MCPx0008", "EffectBoolArg has invalid value", arg);
    }
    return !!parsed;
  }
}
