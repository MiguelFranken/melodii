import { Controller, Message, OnMessage } from '../decorator';
import { IOSCMessage } from '../osc/osc-message';
import { Arc } from '../instruments/arc';

@Controller('/arc')
export class ArcController {
    constructor(private arc: Arc) { }

    @OnMessage('/set')
    public trigger(@Message() message: IOSCMessage) {
        const { args } = message;
        const note = args[0].value.toString();
        const strength: any = args[1].value;

        this.arc.set(note, strength);
    }
}
