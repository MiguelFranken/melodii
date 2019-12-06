import { Component, OnInit } from '@angular/core';
import { SocketServer } from './library/socket/socket-server';
import { CONTROLLERS } from './library/controllers';
import { environment } from '../../environments/environment';
import { container } from './library/decorator/container';

@Component({
  selector: 'mcp-generator',
  template: '',
})
export class GeneratorComponent implements OnInit {

  constructor(private socket: SocketServer) {
    socket.connect(environment.GENERATOR_URL);
    socket.addControllers(CONTROLLERS);
  }

  ngOnInit() {
  }

}
