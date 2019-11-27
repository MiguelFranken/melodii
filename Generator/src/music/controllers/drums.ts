import { Controller, Message, OnMessage } from "../decorator";
import { IOSCMessage } from "../../osc/osc-message";
import { Music } from '../music';
import { Drums_snare } from '../instruments/drum_snare';
import { Drums_kick } from '../instruments/drum_kick';
import { Drums_hihat } from '../instruments/drum_hihat';

type Velocity = number;

@Controller('/drums')
export class DrumsController {

    constructor(
        private music: Music, 
        private drums_snare: Drums_snare,
        private drums_kick: Drums_kick,
        private drums_hihat: Drums_hihat,
    ) {}

    @OnMessage()
    public receivedMsg(@Message() message: IOSCMessage) {

    }

    @OnMessage('/snare')
    public receivedMsgSnareTriggerRelease(@Message() message: IOSCMessage) {
        let velocity: Velocity = parseFloat(message.args[0].value.toString());
        this.drums_snare.triggerRelease(velocity);
    }

    @OnMessage('/kick')
    public receivedMsgKick(@Message() message: IOSCMessage) {
        let velocity: Velocity = parseFloat(message.args[0].value.toString());
        this.drums_kick.triggerRelease(velocity);
    }

    @OnMessage('/hihat')
    public receivedMsgHiHat(@Message() message: IOSCMessage) {
        let velocity: Velocity = parseFloat(message.args[0].value.toString());
        this.drums_hihat.triggerRelease(velocity);
    }



}
