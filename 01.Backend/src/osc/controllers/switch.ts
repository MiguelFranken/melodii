import { Controller, Message, OnMessage } from "../decorators";
import { OSCInputMessage } from "../osc-input-message";
import { SocketServer } from "../../socket/socket-server";
import { Event } from "../../socket/socket-events";
import { Music } from "../../music/music";

@Controller('/clean_switch_1')
export class SwitchController {

  constructor(private socketServer: SocketServer, private music: Music) {
  }

  @OnMessage()
  notifyFrontend(@Message() message: OSCInputMessage) {
    console.log("Notify frontend..");
    this.socketServer.emit(Event.PLAYED_NOTE, "Played some note..");
  }

  @OnMessage()
  playNote(@Message() message: OSCInputMessage) {
    console.log("Playing note..");
    this.music.playNote();
  }

}
