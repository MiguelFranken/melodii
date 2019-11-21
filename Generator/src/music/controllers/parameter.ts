import { IOSCMessage } from '../../osc/osc-message';
import { IOSCArgs } from '../../osc/osc-types';

/**
 * Controls the parameter of the osc messages handled form the controllers
 */
export default class Parameter {

    constructor() {

    }

    public retrieveParameter(msg: IOSCMessage) {
        let { args } = msg;
        let lenght = args.length
    }

    private validNote(arg: IOSCArgs) {
        if (arg)
    }
}