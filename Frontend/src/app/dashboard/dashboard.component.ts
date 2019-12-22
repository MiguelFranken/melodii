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

  constructor() { }

  ngOnInit(): void {
  }

}
