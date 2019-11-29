import { Controller, Message, OnMessage } from '../decorator/decorators';
import { IOSCMessage } from '../osc/osc-message';
import { Music } from '../music';

@Controller('/play_note')
export class PlayNoteController {

  constructor(private music: Music) {
  }

  @OnMessage()
  public receivedMessage(@Message() message: IOSCMessage) {
    const { args } = message;
    const note = args[0].value.toString();

    // velocity should be in normal range ([0,1])
    let velocity = 0.1;
    if (args.length > 1 && args[1].type === 'f' &&
      args[1].value >= 0 && args[1].value <= 1) {
      velocity = parseFloat(args[1].value.toString());
    }

    // volume is measured in dB
    let volume = 0;
    if (args.length > 2 && args[2].type === 'i') {
      volume = parseInt(args[2].value.toString());
      if (isNaN(volume)) {
        volume = 0;
      }
    }
    this.music.playNote(note, velocity, volume);
  }

  @OnMessage('/start')
  public receivedMessageStart(@Message() message: IOSCMessage) {
    const { args } = message;
    const note = args[0].value.toString();

    let volume: number;
    if (args.length === 2 && args[1].type === 'i') {
      volume = parseInt(args[1].value.toString());
    } else if (args.length === 3 && args[2].type === 'i') {
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
