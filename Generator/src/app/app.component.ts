import { Component } from '@angular/core';
import { path } from './generator/config';
import { SocketServer } from './generator/socket-server';
import { CONTROLLERS } from './generator/controllers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  constructor() {
    const socket = new SocketServer(path);
    socket.addControllers(CONTROLLERS);
  }

}
