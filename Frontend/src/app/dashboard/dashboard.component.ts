import { Component, OnInit } from '@angular/core';
import { Action } from '../shared/socket/action';
import { Event } from '../shared/socket/event';
import { SocketService } from '../shared/socket/socket.service';
import { IOSCMessage } from '../shared/osc/osc-message';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public messages: string[] = [];
  public sliderValue = 0;

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.initIoConnection();
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.socketService.onEvent(Event.OSC_MESSAGE)
      .subscribe((msg: IOSCMessage) => {
        this.messages.push(JSON.stringify(msg));
      });

    // this.socketService.onEvent(Event.SLIDER_UPDATE)
    //   .subscribe((value: number) => {
    //     this.sliderValue = value;
    //   });
  }

  // send actions back to osc server
  // TODO MF: Handler on osc server side necessary
  public send(action: Action, data: any): void {
    // switch (action) {
    //   case Action.JOINED:
    //     break;
    //   case Action.LEFT:
    //     break;
    //   case Action.RENAME:
    //     break;
    // }

    this.socketService.send(action, data);
  }

}
