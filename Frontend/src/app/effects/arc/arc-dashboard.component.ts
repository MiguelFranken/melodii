import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Context, Gain, MembraneSynth, MonoSynth, NoiseSynth, Transport } from 'tone';
import { IOSCMessage } from "../../shared/osc/osc-message";
import { GeneratorCommunicationService } from "../../generator/library/generator-communication.service";
import { Logger } from "@upe/logger";

@Component({
  selector: 'mcp-arc-dashboard',
  templateUrl: './arc-dashboard.component.html',
  styleUrls: ['./arc-dashboard.component.scss']
})
export class ArcDashboardComponent implements OnInit {

  ngOnInit(): void {
  }

}
