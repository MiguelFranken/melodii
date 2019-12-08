import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IOSCMessage } from './osc/osc-message';
import { Logger } from '@upe/logger';
import { LogService } from '../log/log.service';
import { SocketService } from '../../shared/socket/socket.service';
import { Action } from '../../shared/socket/action';

@Injectable({
  providedIn: 'root'
})
export class GeneratorCommunicationService {

  private useDirectCommunication = true;

  private logger: Logger = new Logger({ name: 'DirectCommunicationService', flags: ['service'] });

  private _subject: BehaviorSubject<IOSCMessage> = new BehaviorSubject<IOSCMessage>(null);

  constructor(private socketService: SocketService, private log: LogService) {
    this.socketService.initSocket();
    this.logger.info(`Initialized successfully communication service`);
  }

  public sendMessage(msg: IOSCMessage) {
    if (this.useDirectCommunication) {
      this._subject.next(msg);
      this.log.addMessage(JSON.stringify(msg));
      this.logger.info('Forwarded osc message directly to tone generator', msg);
    } else {
      this.socketService.send(Action.REDIRECT_OSC_MESSAGE, msg);
    }
  }

  public switchDirectCommunication() {
    this.useDirectCommunication = !this.useDirectCommunication;
  }

  public getObservable() {
    return this._subject.asObservable();
  }

}
