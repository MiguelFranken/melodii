import { Controller, Message, OnMessage } from '../decorators';
import { OSCMessage } from '../osc/osc-message';
import { Logger } from "@overnightjs/logger";

@Controller()
export class LoggerController {

  @OnMessage()
  public receivedMessage(@Message() message: OSCMessage) {
    Logger.Info(`Remote address is: '${message.info.address}'`);
    Logger.Info(JSON.stringify(message, null, 2));
  }

}
