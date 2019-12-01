import { IOSCArgs } from '../osc/osc-types';
import { IOSCMessage } from '../osc/osc-message';

export type Note = string;
export type Velocity = number;
export type Cents = number;
export type Duration = string | number;

export class OSCError {
    public msg: string;
    constructor(msg: string) {
        this.msg = msg;
    }
    public print() {
        console.error(this.msg);
    }
}

export class TypeChecker {
    constructor() {

    }

    public static validNote(args: IOSCArgs): Note {
        const { type } = args;
        const value = args.value.toString();
        const regex = /^[A-G][b#][0-9]$/;
        if (type != "s") {
            throw new OSCError("Note has invalid type");
        } else if (!value.match(regex)) {
            throw new OSCError("Note has invalid value");
        }
        return value;
    }

    public static validVelocity(args: IOSCArgs): boolean {
        const { type, value } = args; 
        if (type != "f") {
            throw new OSCError("Velocity has invalid type");
        } else if(value != 3) {
            throw new OSCError("Velocity has invalid type");
        }
        return false;
    }

    public static validDuration(args: IOSCArgs): boolean {
        
        return false;
    }
}