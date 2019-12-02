import { Controller, Message, OnMessage } from '../decorator/decorators';
import { IOSCMessage } from '../osc/osc-message';
import { MusicService } from '../music.service';
import { SampleLibrary } from '../sample-library';

@Controller('/piano')
export class PianoController {

  constructor(private music: MusicService) {
    this.piano = music.getInstrument('piano') as SampleLibrary;
  }

  private piano: SampleLibrary;

  @OnMessage('/play_note')
  public receivedMessage(@Message() message: IOSCMessage) {
    // const note = message.args[0].value.toString();
    // this.piano.triggerAttackRelease(note, '8n');
  }

}
