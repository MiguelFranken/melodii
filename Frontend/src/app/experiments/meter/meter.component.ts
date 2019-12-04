import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MusicService } from '../../generator/library/music.service';
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

  constructor(private musicService: MusicService) {
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
      this.musicService.getMeter('master-left'),
      this.musicService.getMeter('master-right'),
      this.cvsMaster.nativeElement,
      this.ctxMaster
    );
    this.meterVisualizationMaster.animate();
  }

  private initKickMeter() {
    this.meterVisualizationKick = new MeterVisualization(
      this.musicService.getMeter('kick-left'), // TODO MF: Namen müssen wahrscheinlich angepasst werden
      this.musicService.getMeter('kick-right'), // TODO MF: Namen müssen wahrscheinlich angepasst werden
      this.cvsKick.nativeElement,
      this.ctxKick
    );
    this.meterVisualizationKick.animate();
  }

  private initSnareMeter() {
    this.meterVisualizationSnare = new MeterVisualization(
      this.musicService.getMeter('snare-left'), // TODO MF: Namen müssen wahrscheinlich angepasst werden
      this.musicService.getMeter('snare-right'), // TODO MF: Namen müssen wahrscheinlich angepasst werden
      this.cvsSnare.nativeElement,
      this.ctxSnare
    );
    this.meterVisualizationSnare.animate();
  }

  private initHihatMeter() {
    this.meterVisualizationHihat = new MeterVisualization(
      this.musicService.getMeter('hihat-left'), // TODO MF: Namen müssen wahrscheinlich angepasst werden
      this.musicService.getMeter('hihat-right'), // TODO MF: Namen müssen wahrscheinlich angepasst werden
      this.cvsHihat.nativeElement,
      this.ctxHihat
    );
    this.meterVisualizationHihat.animate();
  }

}
