import { Controller, Message, OnMessage } from '../decorator';
import { IOSCMessage } from '../osc/osc-message';
import { Music } from '../music';

@Controller('/drums')
export class DrumsController {

    constructor(private music: Music) { }

    @OnMessage('/snare')
    public receivedMsgSnare(@Message() message: IOSCMessage) {
        this.music.playDrums('snare');
    }

    @OnMessage('/kick')
    public receivedMsgKick(@Message() message: IOSCMessage) {
        this.music.playDrums('kick');
    }

    @OnMessage('/hihat')
    public receivedMsgHiHat(@Message() message: IOSCMessage) {
        this.music.playDrums('hihat');
    }



}
