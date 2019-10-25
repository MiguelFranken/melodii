import { Controller, Message, OnMessage, Web } from '../decorators';
import { OSCMessage } from '../osc/osc-message';
import { SocketServer } from "../socket/socket-server";
import { Event } from "../socket/socket-events";

@Controller("/clean_slider_1")
export class SliderController {

  @OnMessage()
  public receivedMessage(@Message() message: OSCMessage, @Web() web: SocketServer) {
    web.emit(Event.SLIDER_UPDATE, Math.round(message.getArgs()[0].value * 100));
  }

}
