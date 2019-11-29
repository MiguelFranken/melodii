import { IOSCMessage } from '../osc/osc-message';
import { Controller, Message, OnMessage } from '../decorator/decorators';
import { Logger } from '@upe/logger';

@Controller()
export class LoggerController {

  private logger: Logger = new Logger({ name: 'LoggerController', flags: ['controller'] });

  @OnMessage()
  public receivedMessage(@Message() message: IOSCMessage) {
    this.logger.info('Received OSC message', message);
  }

}
