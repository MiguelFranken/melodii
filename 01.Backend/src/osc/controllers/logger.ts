import { Controller, Message, OnMessage } from '../decorators';
import { Logger } from "@overnightjs/logger";
import { OSCInputMessage } from "../osc-input-message";

@Controller()
export class LoggerController {

  @OnMessage()
  public receivedMessage(@Message() message: OSCInputMessage) {
    Logger.Info(`Remote address is: '${message.getInfo().address}'`);
    Logger.Info(JSON.stringify(message, null, 2));
  }

}
