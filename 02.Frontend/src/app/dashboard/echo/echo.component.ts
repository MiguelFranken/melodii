import { Component, OnInit } from '@angular/core';
import { SocketService } from "../../shared/socket/socket.service";
import { Event } from "../../shared/socket/event";

@Component({
  selector: 'app-echo',
  templateUrl: './echo.component.html',
  styleUrls: ['./echo.component.scss']
})
export class EchoComponent implements OnInit {

  public isActive = false;

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    this.socketService.onEvent(Event.ECHO_EFFECT_SWITCH)
      .subscribe(() => {
        this.isActive = !this.isActive;
      });
  }

}
