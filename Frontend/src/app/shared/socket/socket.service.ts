import { Injectable } from '@angular/core';
import { Event } from './event';
import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs';
import { Action } from './action';
import { environment } from '../../../environments/environment';
import { IOSCMessage } from '../osc/osc-message';
import { Logger } from '@upe/logger';

@Injectable()
export class SocketService {

  private logger: Logger = new Logger({ name: 'Socket Prototype', flags: ['service'] });

  private socket: SocketIOClient.Socket;

  private socketAddress = environment.SERVER_URL;

  public initSocket(): Observable<any> {
    this.logger.info(`Establishing websocket connection (${this.socketAddress})`);
    this.socket = socketIo(this.socketAddress);

    const connected: Observable<any> = this.onEvent(Event.CONNECT);
    connected.subscribe(() => {
        // Todo: Snackbar
        this.logger.info(`Established websocket connection (${this.socketAddress})`);
      });

    this.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        // Todo: Snackbar
        this.logger.info(`Disconnected websocket connection (${this.socketAddress})`);
      });

    this.onEvent(Event.CONNECT_FAILED)
      .subscribe(() => {
        this.logger.error(`Could not connect to the web socket (${this.socketAddress})`);
      });

    return connected;
  }

  public closeSocket() {
    if (this.socket) {
      this.socket.close();
    } else {
      this.logger.error("Cannot close as socket connection wasn't established yet");
    }
  }

  // TODO: Test if address is well-formed and valid
  public setAddress(address: string) {
    this.logger.info(`Set WebSocket address to ${address}`);
    this.socketAddress = address;
  }

  public send(action: Action, message: any) {
    this.logger.info(`Emitting message on socket (${this.socketAddress}):`, action, message);
    this.socket.emit(action, message);
  }

  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, (data: any) => observer.next(data));
    });
  }

  /**
   * This method listens on the connected websocket to OSC messages with the specified address.
   * If such an address is found, then a value is output via the observable.
   * Users of this method therefore subscribe to the returned observable in
   * order to be able to react to OSC messages with a certain address.
   * @param address Address of the OSC messages you want to react to
   */
  public onAddress(address: string): Observable<IOSCMessage> {
    return new Observable<IOSCMessage>(observer => {
      this.socket.on(Event.OSC_MESSAGE, (msg: IOSCMessage) => {
        this.logger.info('Received OSC message:', msg);
        if (msg.address === address) {
          observer.next(msg);
        }
      });
    });
  }

}
