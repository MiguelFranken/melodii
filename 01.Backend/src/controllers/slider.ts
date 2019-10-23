import { Controller, Message, OnMessage } from '../decorators';
import { OSCMessage } from '../osc/osc-message';

@Controller("/clean_switch_1")
export class SliderController {

  @OnMessage()
  public receivedMessage(@Message() message: OSCMessage) {
    console.log('IT WORKED!');
    console.log(message);
  }

}
