import { Component, OnInit } from '@angular/core';
import { LogService } from './log.service';

@Component({
  selector: 'mcp-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent {

  constructor(private log: LogService) { }

  messagesToDisplay() {
    return this.log.getMessages();
  }

  messagesOmitted() {
    return this.log.messagesOmitted();
  }
}
