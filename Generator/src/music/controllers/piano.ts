import { Controller, Message, OnMessage } from "../decorator";
import { IOSCMessage } from "../../osc/osc-message";
import { Music } from '../music';

@Controller('/piano')
export class PianoController {

  constructor(private music: Music) { }

  @OnMessage('/play_note')
  public receivedMessage(@Message() message: IOSCMessage) {
    this.music.pianoPlayNote(message.args[0].value.toString());
  }

}
