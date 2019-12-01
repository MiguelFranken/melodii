import { Controller, Message, OnMessage } from "../decorator/decorators";
import { IOSCMessage } from "../osc/osc-message";
import { MusicService } from '../music.service';
import { DrumsHiHat } from '../instruments/drums_hihat';
import { TypeChecker, OSCError } from '../types';

@Controller('/drums')
export class DrumsController {

    constructor(private music: MusicService) {}

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
            
            this.music.instruments.drums_hihat.trigger(duration, velocity);
        } catch(e) {
            if (e instanceof OSCError) {
                e.print();
            }
        }
    }



}
