import { Controller, Message, OnMessage } from '../decorator';
import { IOSCMessage } from '../osc/osc-message';
import { Box } from '../instruments/box';

@Controller('/box')
export class BoxController {
    constructor(private box: Box) { }

    @OnMessage('/trigger')
    public trigger(@Message() message: IOSCMessage) {
        const { args } = message;
        const note = args[0].value.toString();
        const velocity: any = args[1].value;

        this.box.trigger(note, velocity);
    }

    @OnMessage(`/detune`)
    public detune(@Message() message: IOSCMessage) {
        const { args } = message;
        const note = args[0].value.toString();
        const cents: any = args[1].value;

        this.box.detune(note, cents);
    }

    @OnMessage('/release')
    public release(@Message() message: IOSCMessage) {
        const { args } = message;
        const note = args[0].value.toString();

        this.box.release(note);
    }
}
