import { Controller, Message, OnMessage } from "../decorator/decorators";
import { IOSCMessage } from "../osc/osc-message";
import { MusicService } from '../music.service';
import { DrumsHiHat } from '../instruments/drums/drums_hihat';
import { DrumsKick } from '../instruments/drums/drums_kick';
import { DrumsSnare } from '../instruments/drums/drums_snare';
import { OSCError } from '../error';
import { TypeChecker } from '../type-checker';

@Controller('/drums')
export class DrumsController {

    private synthHihat: DrumsHiHat;
    private synthKick: DrumsKick;
    private synthSnare: DrumsSnare;

    constructor(private music: MusicService) {
        this.synthHihat = this.music.getInstrument('DrumsHiHat') as DrumsHiHat;
        this.synthKick = this.music.getInstrument('DrumsHiHat') as DrumsKick;
        this.synthSnare = this.music.getInstrument('DrumsHiHat') as DrumsSnare;
    }

    @OnMessage('/snare')
    public receivedMsgSnare(@Message() msg: IOSCMessage) {
        try {
            const duration = TypeChecker.ValidDuration(msg.args);
            const velocity = TypeChecker.ValidVelocity(msg.args);

            this.synthSnare.triggerRelease(duration, velocity);
        } catch (e) {
            if (e instanceof OSCError) {
                e.print();
            }
        }
    }

    @OnMessage('/kick')
    public receivedMsgKick(@Message() msg: IOSCMessage) {
        try {
            const duration = TypeChecker.ValidDuration(msg.args);
            const velocity = TypeChecker.ValidVelocity(msg.args);

            this.synthKick.triggerRelease(duration, velocity);
        } catch (e) {
            if (e instanceof OSCError) {
                e.print();
            }
        }
    }

    @OnMessage('/hihat')
    public receivedMsgHiHat(@Message() msg: IOSCMessage) {
        try {
            const duration = TypeChecker.ValidDuration(msg.args);
            const velocity = TypeChecker.ValidVelocity(msg.args);

            this.synthHihat.triggerRelease(duration, velocity);
        } catch (e) {
            if (e instanceof OSCError) {
                e.print();
            }
        }
    }



}
