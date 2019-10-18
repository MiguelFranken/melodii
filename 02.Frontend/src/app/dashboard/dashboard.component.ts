import { Component, OnInit } from '@angular/core';
import { Action } from '../shared/socket/action';
import { Event } from '../shared/socket/event';
import { SocketService } from '../shared/socket/socket.service';

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

    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        // Todo: Snackbar
        console.log('connected');
      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        // Todo: Snackbar
        console.log('disconnected');
      });

    this.socketService.onEvent(Event.PLAYED_NOTE)
      .subscribe((data: string) => {
        this.messages.push(data);
      });

    this.socketService.onEvent(Event.SLIDER_UPDATE)
      .subscribe((value: number) => {
        this.sliderValue = value;
      });
  }

  public send(action: Action, data: any): void {

    // todo
    switch (action) {
      case Action.JOINED:
        break;
      case Action.LEFT:
        break;
      case Action.RENAME:
        break;
    }

    this.socketService.send(action, data);
  }

}
