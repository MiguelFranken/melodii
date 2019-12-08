import { Component, OnInit } from '@angular/core';
import { Event } from '../shared/socket/event';
import { SocketService } from '../shared/socket/socket.service';
import { IOSCMessage } from '../shared/osc/osc-message';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.initIoConnection();
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.socketService.onEvent(Event.OSC_MESSAGE)
      .subscribe((msg: IOSCMessage) => {
      });
  }

}
