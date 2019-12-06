import { Controller, Message, OnMessage } from '../decorator/decorators';
import { IOSCMessage } from '../osc/osc-message';
import { Arc } from '../instruments/arc';
import { Logger } from '@upe/logger';

@Controller('/arc')
export class ArcController {

    private logger: Logger = new Logger({ name: 'ArcController', flags: ['music'] });

    constructor(private arc: Arc) { }

    @OnMessage('/set')
    public trigger(@Message() message: IOSCMessage) {
        const { args } = message;
        const note = args[0].value.toString();
        const strength: any = args[1].value;

        this.arc.set(note, strength);
        this.logger.info('Set', { note, strength });
    }
}
