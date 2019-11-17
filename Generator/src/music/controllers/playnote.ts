import { Controller, Message, OnMessage } from "../decorator";
import { IOSCMessage } from "../../osc/osc-message";
import { Music } from '../music';

@Controller('/play_note')
export class PlayNoteController {

  constructor(private music: Music) { }

  @OnMessage()
  public receivedMessage(@Message() message: IOSCMessage) {
    this.music.playNote(message.args[0].value.toString());
  }

  @OnMessage('/start')
  public receivedMessageStart(@Message() message: IOSCMessage) {
    this.music.startLongNote(message.args[0].value.toString());
  }

  @OnMessage('/stop')
  public receivedMessageStop(@Message() message: IOSCMessage) {
    this.music.stopLongNote();
  }

}
