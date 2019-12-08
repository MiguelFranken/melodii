import { Controller, Message, OnMessage } from '../decorator/decorators';
import { IOSCMessage } from '../osc/osc-message';
import { Box } from '../instruments/box';
import { Logger } from '@upe/logger';
import { MusicService } from '../music.service';

@Controller('/box')
export class BoxController {

    private logger: Logger = new Logger({ name: 'BoxController', flags: ['music'] });

    constructor(music: MusicService, private box: Box) {
        music.addInstrument(box, "Box");
    }

    @OnMessage('/trigger')
    public trigger(@Message() message: IOSCMessage) {
        const { args } = message;
        const note = args[0].value.toString();
        const velocity: any = args[1].value;

        this.box.trigger(note, velocity);
        this.logger.info('Trigger', { note, velocity });
    }

    @OnMessage('/detune')
    public detune(@Message() message: IOSCMessage) {
        const { args } = message;
        const note = args[0].value.toString();
        const cents: any = args[1].value;

        this.box.detune(note, cents);
        this.logger.info('Detune', { note, cents });
    }

    @OnMessage('/release')
    public release(@Message() message: IOSCMessage) {
        const { args } = message;
        const note = args[0].value.toString();

        this.box.release(note);
        this.logger.info('Release', note);
    }
}
