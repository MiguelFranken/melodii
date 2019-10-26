import { Controller, Message, OnMessage } from '../decorators';
import { OSCMessage } from '../osc/osc-message';
import { SocketServer } from "../socket/socket-server";
import { Event } from "../socket/socket-events";
import { Foo } from "./foo";

@Controller("/clean_slider_1")
export class SliderController {

  constructor(private foo: Foo, private socketServer: SocketServer) {
  }

  @OnMessage()
  public receivedMessage(@Message() message: OSCMessage) {
    this.foo.test();
    this.socketServer.emit(Event.SLIDER_UPDATE, Math.round(message.getArgs()[0].value * 100));
  }

}
