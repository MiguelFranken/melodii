import { IOSCArg } from './osc/osc-types';
import { OSCError } from './error';
import { Cents, Duration, Note, Velocity } from './types';

export class TypeChecker {

  constructor() {
  }

  public static ValidNote(args: IOSCArg[]): Note {
    const { type } = args[0];
    const value = args[0].value.toString();
    const regex = /^[A-G][b#][0-9]$/;
    if (type !== "s") {
      throw new OSCError("MCPx0000", "Note has invalid type");
    } else if (!value.match(regex)) {
      throw new OSCError("MCPx0001", "Note has invalid value");
    }
    return value;
  }

  public static ValidVelocityArg(arg: IOSCArg) {
    const regex = /^[0-9.]$/; // TODO MF: Das ist falsch. Es gehen auch Werte durch die nicht in der Range sind.
    const { type, value } = arg;
    const parsed = parseFloat(value.toString());
    if (type !== "f") {
      throw new OSCError("MCPx0002", "Velocity has invalid type", arg);
    } else if (!String(value).match(regex)) {
      // velocity should be in normal range ([0,1])
      throw new OSCError("MCPx0003", "Velocity value is not in normal range ([0,1])", arg);
    } else if (isNaN(parsed)) {
      throw new OSCError("MCPx0004", "Velocity value matches not the right type", arg);
    }
    return parsed;
  }

  public static ValidVelocity(args: IOSCArg[]): Velocity | undefined {
    if (args.length < 2) {
      return undefined;
    }
    const regex = /^[0-9.]+$/; // TODO MF: Das ist wohl falsch. Es gehen auch Werte durch die nicht in der Range sind.
    const { type, value } = args[1];
    const parsed = parseFloat(value.toString());
    if (type !== "f") {
      throw new OSCError("MCPx0002", "Velocity has invalid type");
    } else if (!String(value).match(regex)) {
      // velocity should be in normal range ([0,1])
      throw new OSCError("MCPx0003", "Velocity value is not in normal range ([0,1])");
    } else if (isNaN(parsed)) {
      throw new OSCError("MCPx0004", "Velocity value matches not the right type");
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

  public static ValidDuration(args: IOSCArg[]): Duration | undefined {
    if (args.length < 3) {
      return undefined;
    }
    const { type, value } = args[2];
    if (type !== "s") {
      throw new OSCError("MCPx0005", "Duration has invalid type");
    }
    // TODO
    return value;
  }

  public static ValidCents(args: IOSCArg[]): Cents | undefined {
    // TODO
    const { type, value } = args[1];
    // return value;
    return value as number;
  }
}
