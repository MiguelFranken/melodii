import { Controller, Message, OnMessage } from '../decorators';
import { SocketServer } from "../../socket/socket-server";
import { Event } from "../../socket/socket-events";
import { Foo } from "./foo";
import { OSCInputMessage } from "../osc-input-message";

@Controller("/clean_slider_1")
export class SliderController {

  constructor(private foo: Foo, private socketServer: SocketServer) {
  }

  @OnMessage()
  public receivedMessage(@Message() message: OSCInputMessage) {
    this.foo.test();
    this.socketServer.emit(Event.SLIDER_UPDATE, Math.round(message.getArgs()[0].value * 100));
  }

}
