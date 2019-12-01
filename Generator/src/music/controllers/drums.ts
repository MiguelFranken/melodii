import { Controller, Message, OnMessage } from "../decorator";
import { IOSCMessage } from "../../osc/osc-message";
import { Music } from '../music';
import { DrumsHiHat } from '../instruments/drums_hihat';
import { TypeChecker, OSCError } from '../types';

@Controller('/drums')
export class DrumsController {

    constructor(private music: Music) {}

    @OnMessage('/snare')
    public receivedMsgSnare(@Message() msg: IOSCMessage) {
        
    }

    @OnMessage('/kick')
    public receivedMsgKick(@Message() msg: IOSCMessage) {
        this.music.playDrums('kick');
    }

    @OnMessage('/hihat')
    public receivedMsgHiHat(@Message() msg: IOSCMessage) {
        try {
            const duration = TypeChecker.validDuration(msg.args[0]);
            const velocity = TypeChecker.validVelocity(msg.args[1]);
            
            DrumsHiHat.synth.trigger(duration, velocity);
        } catch(e) {
            if (e instanceof OSCError) {
                e.print();
            }
        }
    }



}
