import { EventEmitter, Injectable } from '@angular/core';

type MessageQueue = { index: string, message: string }[];

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private receiveEvent: EventEmitter<any> = new EventEmitter();

  private maxMessagesSaved = 100;
  private messageCounter = 0;
  private messages: MessageQueue = [];

  public getEventObservable() {
    return this.receiveEvent.asObservable();
  }

  public getMessages(): MessageQueue {
    return this.messages;
  }

  public messagesOmitted(): boolean {
    return this.messageCounter > this.maxMessagesSaved;
  }

  public addMessage(message: string) {
    if (this.messageCounter !== undefined) {
      const index = this.messageCounter.toString().padStart(4, "0");
      this.messages.unshift({ index, message });
      this.messageCounter++;
      if (this.messages.length > this.maxMessagesSaved) {
        this.messages.splice(this.maxMessagesSaved); // Remove extra messages from end of array.
      }
      this.receiveEvent.emit();
    }
  }

  public addErrorMessage(message: string) {
    this.addMessage(`<b style="color: #FF8269">${message}</b>`);
  }

}
