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

    private synthHihat: DrumsHiHat;
    private synthKick: DrumsKick;
    private synthSnare: DrumsSnare;

    constructor(private music: MusicService) {
        this.synthHihat = this.music.getInstrument('hihat') as DrumsHiHat;
        this.synthKick = this.music.getInstrument('kick') as DrumsKick;
        this.synthSnare = this.music.getInstrument('snare') as DrumsSnare;
    }

    @OnMessage('/snare')
    public receivedMsgSnare(@Message() msg: IOSCMessage) {
        try {
            const duration = TypeChecker.ValidDurationArg(msg.args[0]);
            const velocity = TypeChecker.ValidVelocity(msg.args);

            this.logger.debug(`${duration}, ${velocity}`);

            this.synthSnare.triggerRelease(duration, velocity);
            // this.synthSnare.triggerAttack(velocity);
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
            const velocity = TypeChecker.ValidVelocity(msg.args);

            this.synthKick.triggerRelease(duration, velocity);
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
            const velocity = TypeChecker.ValidVelocity(msg.args);

            this.synthHihat.triggerRelease(duration, velocity);
        } catch (e) {
            if (e instanceof OSCError) {
                e.print(this.logger);
            }
        }
    }



}
