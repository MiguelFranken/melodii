import { Injectable } from '@angular/core';
import { Event } from './event';
import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs';
import { Action } from './action';

const SERVER_URL = 'http://localhost:8080';

@Injectable()
export class SocketService {
  private socket;

  public initSocket(): void {
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
}
