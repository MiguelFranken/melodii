import { Component, OnInit } from '@angular/core';
import { SocketServer } from './library/socket-server';
import { CONTROLLERS } from './library/controllers';
import { environment } from '../../environments/environment';
import { container } from './library/decorator/container';

@Component({
  selector: 'mcp-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent implements OnInit {

  constructor(private socket: SocketServer) {
    socket.connect(environment.GENERATOR_URL);
    socket.addControllers(CONTROLLERS);
  }

  ngOnInit() {
  }

}
