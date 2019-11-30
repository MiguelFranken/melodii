import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MusicService } from '../../generator/library/musicService';
import { MeterVisualization } from './meter-visualization';

@Component({
  selector: 'mcp-meter',
  templateUrl: './meter.component.html',
  styleUrls: ['./meter.component.scss']
})
export class MeterComponent implements OnInit {

  private meterVisualizationMaster: MeterVisualization;
  private meterVisualizationKick: MeterVisualization;
  private meterVisualizationSnare: MeterVisualization;
  private meterVisualizationHihat: MeterVisualization;

  @ViewChild('canvasMaster', { static: true })
  cvsMaster: ElementRef<HTMLCanvasElement>;

  @ViewChild('canvasKick', { static: true })
  cvsKick: ElementRef<HTMLCanvasElement>;

  @ViewChild('canvasSnare', { static: true })
  cvsSnare: ElementRef<HTMLCanvasElement>;

  @ViewChild('canvasHiHat', { static: true })
  cvsHihat: ElementRef<HTMLCanvasElement>;

  private ctxMaster: CanvasRenderingContext2D;
  private ctxKick: CanvasRenderingContext2D;
  private ctxSnare: CanvasRenderingContext2D;
  private ctxHihat: CanvasRenderingContext2D;

  constructor() {
  }

  ngOnInit() {
    this.ctxMaster = this.cvsMaster.nativeElement.getContext('2d');
    this.ctxKick = this.cvsKick.nativeElement.getContext('2d');
    this.ctxSnare = this.cvsSnare.nativeElement.getContext('2d');
    this.ctxHihat = this.cvsHihat.nativeElement.getContext('2d');

    this.initMasterMeter();
    this.initKickMeter();
    this.initSnareMeter();
    this.initHihatMeter();
  }

  private initMasterMeter() {
    this.meterVisualizationMaster = new MeterVisualization(
      MusicService.MASTER_METER,
      this.cvsMaster.nativeElement,
      this.ctxMaster
    );
    this.meterVisualizationMaster.animate();
  }

  private initKickMeter() {
    this.meterVisualizationKick = new MeterVisualization(
      MusicService.KICK_METER,
      this.cvsKick.nativeElement,
      this.ctxKick
    );
    this.meterVisualizationKick.animate();
  }

  private initSnareMeter() {
    this.meterVisualizationSnare = new MeterVisualization(
      MusicService.SNARE_METER,
      this.cvsSnare.nativeElement,
      this.ctxSnare
    );
    this.meterVisualizationSnare.animate();
  }

  private initHihatMeter() {
    this.meterVisualizationHihat = new MeterVisualization(
      MusicService.HIHAT_METER,
      this.cvsHihat.nativeElement,
      this.ctxHihat
    );
    this.meterVisualizationHihat.animate();
  }

}
