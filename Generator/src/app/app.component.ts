import 'reflect-metadata';

import { Component } from '@angular/core';

import { path } from './generator/config';
import { SocketServer } from './generator/socket-server';
import { CONTROLLERS } from './generator/controllers';
import { Container } from './generator/decorator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'Generator';

  constructor() {
    const container = new Container();
    const socket = new SocketServer(path);
    console.log(`path is: '${path}'`);
    socket.addControllers(CONTROLLERS);
  }
}
