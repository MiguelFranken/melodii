import { Controller, Message, OnMessage } from "../decorator";
import { IOSCMessage } from "../../osc/osc-message";
import { Music } from '../music';
import { Synth } from '../instruments/synth';

@Controller('/play_note')
export class PlayNoteController {

  constructor(private music: Music, private synth: Synth) { }

  @OnMessage()
  public receivedMessage(@Message() message: IOSCMessage) {
    const {args} = message;
    const note = args[0].value.toString();
    // velocity should be in normalrange ([0,1])
    let velocity: number = 0.1;
    if (args.length > 1     && args[1].type == "f" && 
        args[1].value >= 0  && args[1].value <= 1) {
      velocity = parseFloat(args[1].value.toString());      
    }
     
    this.synth.triggerRelease(note, velocity);
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
    this.synth.trigger(note, volume);
  }

  @OnMessage('/stop')
  public receivedMessageStop(@Message() message: IOSCMessage) {
    let note = message.args[0].value.toString();
    this.synth.release(note);
  }

}
