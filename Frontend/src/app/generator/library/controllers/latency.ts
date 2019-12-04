import { IOSCMessage } from '../osc/osc-message';
import { Controller, Message, OnMessage } from '../decorator/decorators';
import { Logger } from '@upe/logger';

@Controller()
export class LatencyController {

  private logger: Logger = new Logger({ name: 'LatencyController', flags: ['controller'] });

  @OnMessage()
  public receivedMessage(@Message() msg: IOSCMessage) {
    let now = Date.now();
    let past = parseInt(msg.args[0].value.toString());
    let latency = now - past;
    this.logger.info('Received OSC message', msg);
    this.logger.info('Latency: ' + latency);
  }

}
