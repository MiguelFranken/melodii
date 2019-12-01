import { Component, OnInit } from '@angular/core';
import { LogService } from './log.service';

@Component({
  selector: 'mcp-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

  public messages: string[] = [];

  constructor(private log: LogService) { }

  ngOnInit(): void {
    this.messages = this.log.getMessages();
  }

}
