import { Controller, Message, OnMessage } from "../decorator";
import { IOSCMessage } from "../../osc/osc-message";
import { Music } from '../music';

@Controller()
export class LoggerController {

  constructor(private music: Music) {
  }

  @OnMessage()
  public receivedMessage(@Message() message: IOSCMessage) {
    console.log(`Remote address is: '${message.info.address}'`);
    console.log(JSON.stringify(message, null, 2));
    this.music.playNote('8n');
  }

}
