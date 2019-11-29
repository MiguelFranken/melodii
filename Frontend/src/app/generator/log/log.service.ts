import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private messages: string[] = [];

  public getMessages(): string[] {
    return this.messages;
  }

  public addMessage(message: string) {
    this.messages.push();
    this.messages.push(message);
  }

  constructor() { }
}
