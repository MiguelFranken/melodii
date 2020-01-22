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

  constructor(
    private socketService: SocketService,
    private rtc: WebRTC) { }

  public static OscWebSocketAddress;

  private logger: Logger = new Logger({ name: 'AdvancedSettingsComponent', flags: ['component'] });
  public address;

  ngOnInit() {
    AdvancedSettingsComponent.OscWebSocketAddress = environment.SERVER_URL;
    this.address = environment.SERVER_URL;
  }

  // TODO: Put that into a separate service used to (re)establish WebRTC connections
  public saveOSCWebSocketAddress() {
    AdvancedSettingsComponent.OscWebSocketAddress = this.address;
    this.logger.info(AdvancedSettingsComponent.OscWebSocketAddress);

    // close current WebRTC connection
    this.rtc.disconnect();

    // close current websocket connection
    this.socketService.closeSocket();

    // establish new websocket connection
    this.socketService.setAddress(AdvancedSettingsComponent.OscWebSocketAddress);
    this.socketService.initSocket().subscribe(() => {
      // After that: establish new WebRTC connection
      this.rtc.init();
      this.rtc.connect().catch(() => {
        this.logger.error("Could not connect over WebRTC with OSC server after address change");
      });
    });
  }

  public connectToPi() {
    AdvancedSettingsComponent.OscWebSocketAddress = "http://10.0.0.1:8080/";
    this.address = AdvancedSettingsComponent.OscWebSocketAddress;
    this.saveOSCWebSocketAddress();
  }

}
