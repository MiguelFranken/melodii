import { IOSCMessage } from '../osc/osc-message';
import { Controller, Message, OnMessage } from '../decorator/decorators';
import { Logger } from '@upe/logger';
import { MusicService } from '../music.service';

@Controller()
export class LoggerController {

  private logger: Logger = new Logger({ name: 'LoggerController', flags: ['controller'] });

  constructor(private music: MusicService) {
  }

  @OnMessage()
  public receivedMessage(@Message() message: IOSCMessage) {
    this.logger.info('Received OSC message', message);
    this.music.getLogService().addMessage(JSON.stringify(message));
  }

}
