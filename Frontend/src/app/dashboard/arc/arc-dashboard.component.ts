import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Context, Gain, MembraneSynth, MonoSynth, NoiseSynth, Transport } from 'tone';

@Component({
  selector: 'mcp-arc-dashboard',
  templateUrl: './arc-dashboard.component.html',
  styleUrls: ['./arc-dashboard.component.scss']
})
export class ArcDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
