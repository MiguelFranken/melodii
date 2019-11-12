import { Injectable } from '@angular/core';
import { Event } from './event';
import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs';
import { Action } from './action';
import { environment } from '../../../environments/environment';
import { IOSCMessage } from '../osc/osc-message';

const SERVER_URL = environment.production ? 'http://167.172.162.189:8080' : 'localhost:8080';

@Injectable()
export class SocketService {
  private socket;

  public initSocket(): void {
    console.log(`Establishing websocket connection to OSC-Server (${SERVER_URL})`);
    this.socket = socketIo(SERVER_URL);
  }

  public send(action: Action, message: any) {
    this.socket.emit(action, message);
  }

  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, (data: any) => observer.next(data));
    });
  }

  public onAddress(address: string): Observable<IOSCMessage> {
    return new Observable<IOSCMessage>(observer => {
      this.socket.on(Event.OSC_MESSAGE, (msg: IOSCMessage) => {
        if (msg.address === address) {
          observer.next(msg);
        }
      });
    });
  }
}
