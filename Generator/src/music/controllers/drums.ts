import { Controller, Message, OnMessage } from "../decorator";
import { IOSCMessage } from "../../osc/osc-message";
import { Music } from '../music';
import { Velocity, Note } from '../types';
import DrumsSnare from '../instruments/drums_snare';
import DrumsHihat from '../instruments/drums_hihat';
import DrumsKick from '../instruments/drums_kick';

@Controller('/drums')
export class DrumsController {

    constructor(
        private readonly music: Music,
        private readonly drumsSnare: DrumsSnare,
        private readonly drumsKick: DrumsKick,
        private readonly drumsHihat: DrumsHihat,
    ) {}

    @OnMessage('/snare')
    public receivedMsgSnare(@Message() message: IOSCMessage) {
        this.drumsSnare.triggerRelease();
    }

    @OnMessage('/kick')
    public receivedMsgKick(@Message() message: IOSCMessage) {
        this.drumsKick.triggerRelease();
    }

    @OnMessage('/hihat')
    public receivedMsgHiHat(@Message() message: IOSCMessage) {
        this.drumsHihat.triggerRelease();
    }



}
