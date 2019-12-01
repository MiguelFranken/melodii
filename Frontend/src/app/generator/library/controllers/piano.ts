import { Controller, Message, OnMessage } from '../decorator/decorators';
import { IOSCMessage } from '../osc/osc-message';
import { MusicService } from '../music.service';

@Controller('/piano')
export class PianoController {

  constructor(private music: MusicService) { }

  @OnMessage('/play_note')
  public receivedMessage(@Message() message: IOSCMessage) {
    this.music.pianoPlayNote(message.args[0].value.toString());
  }

}
