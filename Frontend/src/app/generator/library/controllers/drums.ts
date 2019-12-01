import { Controller, Message, OnMessage } from "../decorator/decorators";
import { IOSCMessage } from "../osc/osc-message";
import { MusicService } from '../music.service';
import { DrumsHiHat } from '../instruments/drums_hihat';
import { DrumsKick } from '../instruments/drums_kick';
import { DrumsSnare } from '../instruments/drums_snare';
import { TypeChecker, OSCError } from '../types';

@Controller('/drums')
export class DrumsController {
    private synthHihat: DrumsHiHat;
    private synthKick: DrumsKick;
    private synthSnare: DrumsSnare;

    constructor(private music: MusicService) {
        this.synthHihat = music.instruments.hihat;
        this.synthKick = music.instruments.kick;
        this.synthSnare = music.instruments.snare;
    }

    @OnMessage('/snare')
    public receivedMsgSnare(@Message() msg: IOSCMessage) {
        try {
            const duration = TypeChecker.validDuration(msg.args);
            const velocity = TypeChecker.validVelocity(msg.args);
            
            this.synthSnare.triggerRelease(duration, velocity);
        } catch(e) {
            if (e instanceof OSCError) {
                e.print();
            }
        }
    }

    @OnMessage('/kick')
    public receivedMsgKick(@Message() msg: IOSCMessage) {
        try {
            const duration = TypeChecker.validDuration(msg.args);
            const velocity = TypeChecker.validVelocity(msg.args);
            
            this.synthKick.triggerRelease(duration, velocity);
        } catch(e) {
            if (e instanceof OSCError) {
                e.print();
            }
        }
    }

    @OnMessage('/hihat')
    public receivedMsgHiHat(@Message() msg: IOSCMessage) {
        try {
            const duration = TypeChecker.validDuration(msg.args);
            const velocity = TypeChecker.validVelocity(msg.args);
            
            this.synthHihat.triggerRelease(duration, velocity);
        } catch(e) {
            if (e instanceof OSCError) {
                e.print();
            }
        }
    }



}
