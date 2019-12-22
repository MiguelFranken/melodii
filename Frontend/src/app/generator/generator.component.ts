import { Component, OnDestroy, OnInit } from '@angular/core';
import { CONTROLLERS } from './library/controllers';
import { ControllerHandler } from './library/decorator';
import { GeneratorCommunicationService } from './library/generator-communication.service';
import { Logger } from '@upe/logger';
import { LogService } from './log/log.service';
import { SocketService } from "../shared/socket/socket.service";
import { WebRTC } from "./webrtc";

@Component({
  selector: 'mcp-generator',
  template: '',
})
export class GeneratorComponent implements OnInit, OnDestroy {

  private readonly logger: Logger = new Logger({ name: 'GeneratorComponent' });

  constructor(
    private socketService: SocketService,
    private directCommunicationService: GeneratorCommunicationService,
    private rtc: WebRTC, private log: LogService) {
    const controllerHandler = new ControllerHandler(directCommunicationService);
    controllerHandler.addControllers(CONTROLLERS);
  }

  ngOnInit(): void {
    // first connect over websocket to exchange signaling messages
    this.socketService.initSocket().subscribe(() => {
      // after successful Websocket connection establishment, establish WebRTC connection
      this.rtc.init();
      this.rtc.connect().then(() => {
        this.logger.info("Connected to OSC Server");
      });
      this.rtc.getMessages().subscribe(this.log.addMessage);
    });
  }

  ngOnDestroy(): void {
    this.rtc.disconnect();
    this.logger.info("Connected from OSC Server");
  }

}
