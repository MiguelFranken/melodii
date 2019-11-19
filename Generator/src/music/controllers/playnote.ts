import { Controller, Message, OnMessage } from "../decorator";
import { IOSCMessage } from "../../osc/osc-message";
import { Music } from '../music';

@Controller('/play_note')
export class PlayNoteController {

  constructor(private music: Music) { }

  @OnMessage()
  public receivedMessage(@Message() message: IOSCMessage) {
    const {args} = message;
    const note = args[0].value.toString();
    const velocity = (args.length > 1 && args[1].type == "s")? args[1].value.toString():"8n";
    const volume = (args.length > 2 && args[2].type == "i")? parseInt(args[2].value.toString()):1;
    this.music.playNote(note, velocity, volume);
  }

  @OnMessage('/start')
  public receivedMessageStart(@Message() message: IOSCMessage) {
    const {args} = message;
    const note = args[0].value.toString();
    let volume: number;
    if (args.length == 2 && args[1].type == "i") {
      volume = parseInt(args[1].value.toString());
    } else if (args.length == 3 && args[2].type == "i") {
      volume = parseInt(args[2].value.toString());
    } else {
      volume = 1;
    }
    this.music.startLongNote(note, volume);
  }

  @OnMessage('/stop')
  public receivedMessageStop(@Message() message: IOSCMessage) {
    this.music.stopLongNote();
  }

}
