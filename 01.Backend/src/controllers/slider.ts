import { Controller, OnMessage } from '../decorators';

@Controller()
export class SliderController {

  @OnMessage()
  public receivedMessage() {
    console.log('IT WORKED!');
  }

  @OnMessage()
  public receivedMessage2() {
    console.log('IT WORKED AGAIN!');
  }

}
