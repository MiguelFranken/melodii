import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IOSCMessage } from './osc/osc-message';
import { Logger } from '@upe/logger';
import { LogService } from '../log/log.service';
import { WebRTC } from "../webrtc";

@Injectable({
  providedIn: 'root'
})
export class GeneratorCommunicationService {

  private useDirectCommunication = true;

  private logger: Logger = new Logger({ name: 'DirectCommunicationService', flags: ['service'] });

  private _subject: BehaviorSubject<IOSCMessage> = new BehaviorSubject<IOSCMessage>(null);

  constructor(private rtc: WebRTC, private log: LogService) {
  }

  public sendMessage(msg: IOSCMessage) {
    if (this.useDirectCommunication) {
      this._subject.next(msg);
      this.log.addMessage(JSON.stringify(msg));
      this.logger.info('Forwarded osc message directly to tone generator', msg);
    } else {
      this.rtc.send(msg);
    }
  }

  public switchDirectCommunication() {
    this.useDirectCommunication = !this.useDirectCommunication;
  }

  public getObservable() {
    return this._subject.asObservable();
  }

}
