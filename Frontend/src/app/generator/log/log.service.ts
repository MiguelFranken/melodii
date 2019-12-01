import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private receiveEvent: EventEmitter<any> = new EventEmitter();

  private messages: string[] = [];

  public getEventObservable() {
    return this.receiveEvent.asObservable();
  }

  public getMessages(): string[] {
    return this.messages;
  }

  public addMessage(message: string) {
    this.messages.push(message);
    this.receiveEvent.emit();
  }

  constructor() { }
}
