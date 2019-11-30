import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Gain, Meter, MonoSynth } from 'tone';
import { Music } from '../../generator/library/music';

interface IVolume {
  left: number;
  right: number;
}

@Component({
  selector: 'mcp-meter',
  templateUrl: './meter.component.html',
  styleUrls: ['./meter.component.scss']
})
export class MeterComponent implements OnInit {

  private volume: IVolume = {
    left: 100,
    right: 80
  };
  private meterVisualization: MeterVisualization;

  @ViewChild('canvas', { static: true })
  cvs: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  constructor() {
  }

  ngOnInit() {
    this.ctx = this.cvs.nativeElement.getContext('2d');

    this.meterVisualization = new MeterVisualization(
      this.volume,
      this.cvs.nativeElement,
      this.ctx
    );
    this.meterVisualization.draw();

    requestAnimationFrame(this.animate.bind(this));
  }

  private clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  private normalize(value, r1, r2) {
    return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
  }

  public animate() {
    requestAnimationFrame(this.animate.bind(this));

    let meterValue = Music.MASTER_METER.getValue();
    meterValue = this.clamp(meterValue, -100, -10);
    meterValue = this.normalize( meterValue, [ -100, -10 ], [ 0, 100 ] );

    this.volume.left = meterValue;
    this.volume.right = meterValue;
    this.meterVisualization.updateData(this.volume);
    this.meterVisualization.clear();
    this.meterVisualization.draw();
  }

}

class MeterVisualization {

  constructor(private data: IVolume, private canvas: HTMLCanvasElement, private ctx: CanvasRenderingContext2D) {
    this.canvasActualHeight = this.canvas.height - this.padding * 2;
    this.canvasActualWidth = this.canvas.width - this.padding * 2;
    this.barSize = this.canvasActualWidth / 2 - 5; // 2 bars, padding of 5px
  }

  private padding = 10;
  private gridScale = 20;
  private gridColor = "#616161";
  private color = "#595959";
  private maxValue = 100;

  private readonly canvasActualHeight;
  private readonly canvasActualWidth;
  private readonly barSize;

  private static drawGenericBar(ctx: CanvasRenderingContext2D, upperLeftCornerX: number, upperLeftCornerY: number,
                                width: number, height: number, color: string) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(upperLeftCornerX, upperLeftCornerY, width, height);
    ctx.restore();
  }

  public updateData(data: IVolume) {
    this.data = data;
  }

  public clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public draw() {
    //drawing the grid lines
    let gridValue = 0;
    while (gridValue <= this.maxValue) {
      const gridY = this.canvasActualHeight * (1 - gridValue / this.maxValue) + this.padding;
      this.drawLine(
        this.ctx,
        0,
        gridY,
        this.canvas.width,
        gridY,
        this.gridColor
      );

      gridValue += this.gridScale;
    }

    //drawing the volume bars
    this.drawVolumeBar(this.data.left, 0);
    this.drawVolumeBar(this.data.right, 1);
  }

  private drawLine(ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number, color: string) {
    ctx.save(); // ctx.save() and ctx.restore() so that we don't affect the colors used outside this function
    ctx.strokeStyle = color;
    ctx.beginPath(); // informs the drawing context that we are starting to draw something new on the canvas
    ctx.moveTo(startX, startY); // set the starting point
    ctx.lineTo(endX, endY); // indicate the end point
    ctx.stroke(); // do the actual drawing
    ctx.restore();
  }

  private drawVolumeBar(value: number, barIndex: number) {
    const barHeight = Math.round( this.canvasActualHeight * value / this.maxValue) ;
    const marginRight = barIndex > 0 ? 10 : 0;
    MeterVisualization.drawGenericBar(
      this.ctx,
      this.padding + barIndex * this.barSize + marginRight,
      this.canvas.height - barHeight - this.padding,
      this.barSize,
      barHeight,
      this.color
    );
  }

}
