import { Controller, Message, OnMessage } from "../decorator/decorators";
import { IOSCMessage } from "../osc/osc-message";
import { MusicService } from '../music.service';
import { DrumsHiHat, DrumsKick, DrumsSnare } from '../instruments/drums';
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
    public reverb(@Message() msg: IOSCMessage) {
        try {
            const bool = TypeChecker.ValidEffectBoolArg(msg.args[0]);
            if (bool) {
                this.snareInstrument.deleteReverb();
            } else {
                this.snareInstrument.addReverb();
            }
        } catch (e) {
            if (e instanceof OSCError) {
                e.print(this.logger);
            }
        }
    }

    @OnMessage('/snare/effect/pingpongdelay')
    public pingpongdelay(@Message() msg: IOSCMessage) {
        try {
            const bool = TypeChecker.ValidEffectBoolArg(msg.args[0]);
            if (bool) {
                this.snareInstrument.deletePingPongDelay();
            } else {
                this.snareInstrument.addPingPongDelay();
            }
        } catch (e) {
            if (e instanceof OSCError) {
                e.print(this.logger);
            }
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
