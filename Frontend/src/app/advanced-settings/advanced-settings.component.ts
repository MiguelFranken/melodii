import { Component, OnInit } from '@angular/core';
import { SocketService } from "../shared/socket/socket.service";
import { WebRTC } from "../generator/webrtc";
import { environment } from "../../environments/environment";
import { Logger } from "@upe/logger";

@Component({
  selector: 'mcp-advanced-settings',
  templateUrl: './advanced-settings.component.html',
  styleUrls: ['./advanced-settings.component.scss']
})
export class AdvancedSettingsComponent implements OnInit {

  private logger: Logger = new Logger({ name: 'AdvancedSettingsComponent', flags: ['component'] });

  public oscWebSocketAddress = environment.SERVER_URL;

  constructor(
    private socketService: SocketService,
    private rtc: WebRTC) { }

  ngOnInit() {
  }

  // TODO: Put that into a separate service used to (re)establish WebRTC connections
  public saveOSCWebSocketAddress() {
    this.logger.info(this.oscWebSocketAddress);

    // close current WebRTC connection
    this.rtc.disconnect();

    // close current websocket connection
    this.socketService.closeSocket();

    // establish new websocket connection
    this.socketService.setAddress(this.oscWebSocketAddress);
    this.socketService.initSocket().subscribe(() => {
      // After that: establish new WebRTC connection
      this.rtc.init();
      this.rtc.connect().catch(() => {
        this.logger.error("Could not connect over WebRTC with OSC server after address change");
      });
    });
  }

}
