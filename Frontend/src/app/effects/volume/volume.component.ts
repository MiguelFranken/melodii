import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MeterVisualization } from "../../experiments/meter/meter-visualization";
import { MusicService } from "../../generator/library/music.service";

@Component({
  selector: 'mcp-volume',
  templateUrl: './volume.component.html',
  styleUrls: ['./volume.component.scss']
})
export class VolumeComponent implements OnInit {

  private meterVisualizationMaster: MeterVisualization;
  private meterVisualizationMat: MeterVisualization;
  private meterVisualizationBox: MeterVisualization;
  private meterVisualizationArc: MeterVisualization;
  private meterVisualizationCello: MeterVisualization;
  private meterVisualizationDrums: MeterVisualization;
  private meterVisualizationPiano: MeterVisualization;

  @ViewChild('canvasMaster', { static: true })
  cvsMaster: ElementRef<HTMLCanvasElement>;

  @ViewChild('canvasMat', { static: true })
  cvsMat: ElementRef<HTMLCanvasElement>;

  @ViewChild('canvasBox', { static: true })
  cvsBox: ElementRef<HTMLCanvasElement>;

  @ViewChild('canvasArc', { static: true })
  cvsArc: ElementRef<HTMLCanvasElement>;

  @ViewChild('canvasDrums', { static: true })
  cvsDrums: ElementRef<HTMLCanvasElement>;

  @ViewChild('canvasCello', { static: true })
  cvsCello: ElementRef<HTMLCanvasElement>;

  @ViewChild('canvasPiano', { static: true })
  cvsPiano: ElementRef<HTMLCanvasElement>;

  private ctxMaster: CanvasRenderingContext2D;
  private ctxMat: CanvasRenderingContext2D;
  private ctxBox: CanvasRenderingContext2D;
  private ctxArc: CanvasRenderingContext2D;
  private ctxCello: CanvasRenderingContext2D;
  private ctxDrums: CanvasRenderingContext2D;
  private ctxPiano: CanvasRenderingContext2D;

  constructor(private musicService: MusicService) {
  }

  ngOnInit() {
    this.ctxMaster = this.cvsMaster.nativeElement.getContext('2d');
    this.ctxMat = this.cvsMat.nativeElement.getContext('2d');
    this.ctxBox = this.cvsBox.nativeElement.getContext('2d');
    this.ctxArc = this.cvsArc.nativeElement.getContext('2d');
    this.ctxCello = this.cvsCello.nativeElement.getContext('2d');
    this.ctxDrums = this.cvsDrums.nativeElement.getContext('2d');
    this.ctxPiano = this.cvsPiano.nativeElement.getContext('2d');

    this.initMasterMeter();
    this.initMatMeter();
    this.initBoxMeter();
    this.initArcMeter();
    this.initCelloMeter();
    this.initDrumsMeter();
    this.initPianoMeter();
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

  private initMatMeter() {
    this.meterVisualizationMat = new MeterVisualization(
      this.musicService.getMeter('mat-left'), // TODO MF: Namen müssen wahrscheinlich angepasst werden
      this.musicService.getMeter('mat-right'), // TODO MF: Namen müssen wahrscheinlich angepasst werden
      this.cvsMat.nativeElement,
      this.ctxMat
    );
    this.meterVisualizationMat.animate();
  }

  private initBoxMeter() {
    this.meterVisualizationBox = new MeterVisualization(
      this.musicService.getMeter('box-left'), // TODO MF: Namen müssen wahrscheinlich angepasst werden
      this.musicService.getMeter('box-right'), // TODO MF: Namen müssen wahrscheinlich angepasst werden
      this.cvsBox.nativeElement,
      this.ctxBox
    );
    this.meterVisualizationBox.animate();
  }

  private initArcMeter() {
    this.meterVisualizationArc = new MeterVisualization(
      this.musicService.getMeter('arc-left'), // TODO MF: Namen müssen wahrscheinlich angepasst werden
      this.musicService.getMeter('arc-right'), // TODO MF: Namen müssen wahrscheinlich angepasst werden
      this.cvsArc.nativeElement,
      this.ctxArc
    );
    this.meterVisualizationArc.animate();
  }

  private initDrumsMeter() {
    this.meterVisualizationDrums = new MeterVisualization(
      this.musicService.getDrumsMeterLeft(), // TODO MF: Namen müssen wahrscheinlich angepasst werden
      this.musicService.getDrumsMeterRight(), // TODO MF: Namen müssen wahrscheinlich angepasst werden
      this.cvsDrums.nativeElement,
      this.ctxDrums
    );
    this.meterVisualizationDrums.animate();
  }

  private initPianoMeter() {
    this.meterVisualizationPiano = new MeterVisualization(
      this.musicService.getMeter('piano-left'), // TODO MF: Namen müssen wahrscheinlich angepasst werden
      this.musicService.getMeter('piano-right'), // TODO MF: Namen müssen wahrscheinlich angepasst werden
      this.cvsPiano.nativeElement,
      this.ctxPiano
    );
    this.meterVisualizationPiano.animate();
  }

  private initCelloMeter() {
    this.meterVisualizationCello = new MeterVisualization(
      this.musicService.getMeter('cello-left'), // TODO MF: Namen müssen wahrscheinlich angepasst werden
      this.musicService.getMeter('cello-right'), // TODO MF: Namen müssen wahrscheinlich angepasst werden
      this.cvsCello.nativeElement,
      this.ctxCello
    );
    this.meterVisualizationCello.animate();
  }

}
