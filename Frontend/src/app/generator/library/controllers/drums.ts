import { Controller, Message, OnMessage } from "../decorator/decorators";
import { IOSCMessage } from "../osc/osc-message";
import { MusicService } from '../music.service';
import { DrumsHiHat } from '../instruments/drums/drums_hihat';
import { DrumsKick } from '../instruments/drums/drums_kick';
import { DrumsSnare } from '../instruments/drums/drums_snare';
import { OSCError } from '../error';
import { TypeChecker } from '../type-checker';
import { Logger } from '@upe/logger';

@Controller('/drums')
export class DrumsController {

    private logger: Logger = new Logger({ name: 'DrumsController', flags: ['controller'] });

    private hihatInstrument: DrumsHiHat;
    private kickInstrument: DrumsKick;
    private snareInstrument: DrumsSnare;

    constructor(private music: MusicService) {
        this.hihatInstrument = this.music.getInstrument('hihat') as DrumsHiHat;
        this.kickInstrument = this.music.getInstrument('kick') as DrumsKick;
        this.snareInstrument = this.music.getInstrument('snare') as DrumsSnare;
    }

    @OnMessage('/snare/play')
    public receivedMsgSnare(@Message() msg: IOSCMessage) {
        try {
            const duration = TypeChecker.ValidDurationArg(msg.args[0]);
            //TODO add postion to decorators
            const velocity = TypeChecker.ValidVelocityArg(msg.args[1]);

            this.snareInstrument.play(duration, velocity);
        } catch (e) {
            if (e instanceof OSCError) {
                e.print(this.logger);
            }
        }
    }

    @OnMessage('/snare/effect/reverb')
    public reverb(@Message() message: IOSCMessage) {
        if (message.args[0].value === 0) {
            this.snareInstrument.deleteReverb();
        } else {
            this.snareInstrument.addReverb();
        }
    }

    @OnMessage('/snare/effect/pingpongdelay')
    public pingpongdelay(@Message() message: IOSCMessage) {
        if (message.args[0].value === 0) {
            this.snareInstrument.deletePingPongDelay();
        } else {
            this.snareInstrument.addPingPongDelay();
        }
    }

    @OnMessage('/kick')
    public receivedMsgKick(@Message() msg: IOSCMessage) {
        try {
            const duration = TypeChecker.ValidDurationArg(msg.args[0]);
            // TODO add position to decorators
            const velocity = TypeChecker.ValidVelocityArg(msg.args[1]);

            this.kickInstrument.play(duration, velocity);
        } catch (e) {
            if (e instanceof OSCError) {
                e.print(this.logger);
            }
        }
    }

    @OnMessage('/hihat')
    public receivedMsgHiHat(@Message() msg: IOSCMessage) {
        try {
            const duration = TypeChecker.ValidDurationArg(msg.args[0]);
            // TODO add position to decorators
            const velocity = TypeChecker.ValidVelocityArg(msg.args[1]);

            this.hihatInstrument.play(duration, velocity);
        } catch (e) {
            if (e instanceof OSCError) {
                e.print(this.logger);
            }
        }
    }



}
