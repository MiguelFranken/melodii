import { Controller, Message, OnMessage } from "../decorators";
import { OSCInputMessage } from "../osc-input-message";
import { SocketServer } from "../../socket/socket-server";
import { Event } from "../../socket/socket-events";
import { Music } from "../../music/music";

@Controller()
export class SwitchController {

  constructor(private socketServer: SocketServer, private music: Music) {
  }

  @OnMessage('/clean_switch_1', '/clean_switch_2')
  playNoteForSwitch1(@Message() message: OSCInputMessage) {
    this.socketServer.emit(Event.ECHO_EFFECT_SWITCH);
    this.music.switchEchoEffect();
  }

  @OnMessage('/clean_switch_3')
  playNoteForSwitch3(@Message() message: OSCInputMessage) {
    this.music.playChord("C4");
  }

  @OnMessage('/clean_switch_4')
  playNoteForSwitch4(@Message() message: OSCInputMessage) {
    this.music.playChord("D4");
  }

  @OnMessage('/clean_switch_5')
  playNoteForSwitch5(@Message() message: OSCInputMessage) {
    this.music.playChord("E4");
  }

  @OnMessage('/clean_switch_6')
  playNoteForSwitch6(@Message() message: OSCInputMessage) {
    this.music.playChord("F4");
  }

}
