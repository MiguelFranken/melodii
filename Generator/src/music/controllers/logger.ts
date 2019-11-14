import { Controller, Message, OnMessage } from "../decorator";
import { IOSCMessage } from "../../osc/osc-message";

@Controller()
export class LoggerController {

  @OnMessage()
  public receivedMessage(@Message() message: IOSCMessage) {
    console.log(`Remote address is: '${message.info.address}'`);
    console.log(JSON.stringify(message, null, 2));
  }

}
