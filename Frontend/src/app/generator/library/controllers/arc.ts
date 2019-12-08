import { Controller, Message, OnMessage } from '../decorator/decorators';
import { IOSCMessage } from '../osc/osc-message';
import { Arc } from '../instruments/arc';
import { Logger } from '@upe/logger';
import { MusicService } from '../music.service';

@Controller('/arc')
export class ArcController {

    private logger: Logger = new Logger({ name: 'ArcController', flags: ['music'] });

    constructor(music: MusicService, private arc: Arc) {
        music.addInstrument(arc, "Arc");
    }

    @OnMessage('/set')
    public trigger(@Message() message: IOSCMessage) {
        const { args } = message;
        const note = args[0].value.toString();
        const strength: any = args[1].value;

        this.arc.set(note, strength);
        this.logger.info('Set', { note, strength });
    }
}
