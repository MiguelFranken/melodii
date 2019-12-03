import { IOSCArg } from './osc/osc-types';
import { OSCError } from './error';
import { Cents, Duration, Note, Velocity } from './types';

export class TypeChecker {

  private static regex = {
    note: /^[A-G][b#]?[0-9]$/,
    velocity: /^1$|^0$|^0.[0-9]+$/,
    duration: /^$/,
    cents: /^$/,
  };

  constructor() {
  }

  public static ValidNoteArg(arg: IOSCArg) {
    const { type, value } = arg;
    const parsed = String(value);
    if (type !== "s") {
      throw new OSCError("MCPx0000", "Note has invalid type");
    } else if (!parsed.match(TypeChecker.regex.velocity)) {
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

  public static ValidDurationArg(arg: IOSCArg): Duration | undefined {
    const { type, value } = arg;
    if (type !== "s") {
      throw new OSCError("MCPx0005", "Duration has invalid type", arg);
    }
    // TODO
    return value;
  }

  public static ValidCentsArg(arg: IOSCArg): Cents | undefined {
    
    // return value;
    return arg.value as number;
  }
}
