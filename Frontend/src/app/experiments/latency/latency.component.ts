import { Component, OnInit } from '@angular/core';
import { IOSCMessage } from '../../shared/osc/osc-message';
import { interval, Subscription } from 'rxjs';
import { WebRTC } from "../../generator/webrtc";

@Component({
  selector: 'mcp-latency',
  templateUrl: './latency.component.html',
  styleUrls: ['./latency.component.scss']
})
export class LatencyComponent implements OnInit {

  private flowSubscription200: Subscription;
  private flowSubscription50: Subscription;
  private flowSubscription10: Subscription;

  constructor(private rtc: WebRTC) { }

  ngOnInit() {
  }

  public single() {
    const message: IOSCMessage = {
      address: '/latency/single',
      args: [
        { type: 's', value: 'C4' }
      ],
      info: {
        address: '/play_note',
        family: 'IPv4',
        port: 80,
        size: 1,
      },
      timeStart: [performance.now()]
    };
    this.rtc.send(message);
  }

  public startFlow200() {
    this.flowSubscription200 = interval(200).subscribe(() => this.single());
  }

  public stopFlow200() {
    if (this.flowSubscription200) {
      this.flowSubscription200.unsubscribe();
    }
  }

  public startFlow50() {
    this.flowSubscription50 = interval(50).subscribe(() => this.single());
  }

  public stopFlow50() {
    if (this.flowSubscription50) {
      this.flowSubscription50.unsubscribe();
    }
  }

  public startFlow10() {
    this.flowSubscription10 = interval(10).subscribe(() => this.single());
  }

  public stopFlow10() {
    if (this.flowSubscription10) {
      this.flowSubscription10.unsubscribe();
    }
  }

  public log() {
    const message: IOSCMessage = {
      address: '/latency/log',
      args: [
        { type: 's', value: 'C4' }
      ],
      info: {
        address: '/play_note',
        family: 'IPv4',
        port: 80,
        size: 1,
      }
    };
    this.rtc.send(message);
  }

}
