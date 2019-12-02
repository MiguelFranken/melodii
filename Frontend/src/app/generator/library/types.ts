import { IOSCArgs } from './osc/osc-types';
import { OSCError } from './error';
export type Note = string;
export type Velocity = number;
export type Cents = number;
export type Duration = string | number;

export class TypeChecker {

    constructor() {
    }

    public static validNote(args: IOSCArgs[]): Note {
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

    public static validVelocity(args: IOSCArgs[]): Velocity | undefined {
        if (args.length < 2) {
            return undefined;
        }
        const regex = /^[0-9.]+$/;
        const { type, value } = args[1];
        const parsed = parseFloat(value.toString());
        if (type !== "f") {
            throw new OSCError("MCPx0002", "Velocity has invalid type");
        } else if (!String(value).match(regex)) {
            // velocity should be in normal range ([0,1])
            throw new OSCError("MCPx0003", "Velocity value is not as expected");
        } else if (isNaN(parsed)) {
            throw new OSCError("MCPx0004", "Velocity value matches not the right type");
        }
        return parsed;
    }

    public static validDuration(args: IOSCArgs[]): Duration | undefined {
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

    public static validCents(args: IOSCArgs[]): Cents | undefined {
        // TODO
        const { type, value } = args[1];
        // return value;
        return value as number;
    }
}
