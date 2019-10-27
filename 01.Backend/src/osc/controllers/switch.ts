import { Controller, Message, OnMessage } from "../decorators";
import { OSCInputMessage } from "../osc-input-message";
import { SocketServer } from "../../socket/socket-server";
import { Event } from "../../socket/socket-events";
import { Music } from "../../music/music";

@Controller()
export class SwitchController {

  constructor(private socketServer: SocketServer, private music: Music) {
  }

  @OnMessage('/clean_switch_1')
  notifyFrontendForSwitch1(@Message() message: OSCInputMessage) {
    console.log("Notify frontend..");
    this.socketServer.emit(Event.PLAYED_NOTE, "Switch 1 used");
  }

  @OnMessage('/clean_switch_1')
  playNoteForSwitch1(@Message() message: OSCInputMessage) {
    console.log("Playing note fot switch 1..");
    this.music.playNote("C4");
  }

  @OnMessage('/clean_switch_2')
  notifyFrontendForSwitch2(@Message() message: OSCInputMessage) {
    console.log("Notify frontend..");
    this.socketServer.emit(Event.PLAYED_NOTE, "Switch 2 used");
  }

  @OnMessage('/clean_switch_2')
  playNoteForSwitch2(@Message() message: OSCInputMessage) {
    console.log("Playing note fot switch 2..");
    this.music.playNote("D4");
  }

  @OnMessage('/clean_switch_3')
  playNoteForSwitch3(@Message() message: OSCInputMessage) {
    console.log("Playing note for switch 3..");
    this.music.playNote("E4");
  }

  @OnMessage('/clean_switch_4')
  playNoteForSwitch4(@Message() message: OSCInputMessage) {
    console.log("Playing note for switch 4..");
    this.music.playNote("F4");
  }

  @OnMessage('/clean_switch_5')
  playNoteForSwitch5(@Message() message: OSCInputMessage) {
    console.log("Playing note for switch 5..");
    this.music.playNote("G4");
  }

  @OnMessage('/clean_switch_6')
  playNoteForSwitch6(@Message() message: OSCInputMessage) {
    console.log("Playing note for switch 6..");
    this.music.playNote("A4");
  }

}
