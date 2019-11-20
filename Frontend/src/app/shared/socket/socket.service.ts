import { Injectable } from '@angular/core';
import { Event } from './event';
import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs';
import { Action } from './action';
import { environment } from '../../../environments/environment';
import { IOSCMessage } from '../osc/osc-message';

@Injectable()
export class SocketService {
  private socket;

  public initSocket(): void {
    console.log(`Establishing websocket connection to OSC-Server (${environment.SERVER_URL})`);
    this.socket = socketIo(environment.SERVER_URL);
    this.onEvent(Event.CONNECT)
      .subscribe(() => {
        // Todo: Snackbar
        console.log('Established websocket connection to OSC-Server');
      });

    this.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        // Todo: Snackbar
        console.log('Disconnected websocket connection to OSC-Server');
      });
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
