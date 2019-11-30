import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Gain, Meter, MonoSynth } from 'tone';


class Instrument {

  private synth: MonoSynth;
  public gain;
  public meter: Meter;

  constructor() {
    this.synth = new MonoSynth();
    this.synth.volume.value = -20;
    this.gain = new Gain(0.4);
    this.meter = new Meter(0.9);
    this.synth.connect(this.meter);
    this.synth.connect(this.gain);
    this.gain.toDestination();
  }

  // tickResolution() {
  //   console.log('BOX TICK');
  //   this.synth.triggerAttackRelease(Math.random() < 0.5 ? "C2" : "E4", "2n");
  // }

  play() {
    this.synth.triggerAttackRelease(Math.random() < 0.5 ? "C2" : "E4", "2n");
  }

  getMeterValue() {
    return this.meter.getValue();
  }

}

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
  private myBarChart: MeterVisualization;

  @ViewChild('canvas', { static: true })
  cvs: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  private instrument: Instrument;

  constructor() {
    this.instrument = new Instrument();

    // Transport.scheduleRepeat(time => {
    //   this.instrument.tickResolution();
    // }, '2n');
    //
    // Transport.start();
  }

  ngOnInit() {
    this.ctx = this.cvs.nativeElement.getContext('2d');

    this.myBarChart = new MeterVisualization(
      this.volume,
      this.cvs.nativeElement,
      this.ctx
    );
    this.myBarChart.draw();

    requestAnimationFrame(this.animate.bind(this));
  }

  public play() {
    this.instrument.play();
  }

  private clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  private convertRange( value, r1, r2 ) {
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
  }

  public animate() {
    requestAnimationFrame(this.animate.bind(this));

    let meterValue = this.instrument.getMeterValue();
    meterValue = this.clamp(meterValue, -100, -10);
    // console.log('clamp', meterValue);
    meterValue = this.convertRange( meterValue, [ -100, -10 ], [ 0, 100 ] );
    // console.log(meterValue);
    // meterValue = Math.clamp(Math.scale(t,-100,6,0,e),4,e)
    // meterValue = meterValue > -40 ? meterValue * -1 : 0;

    this.volume.left = meterValue;
    this.volume.right = meterValue;
    this.myBarChart.updateData(this.volume);
    this.myBarChart.clear();
    this.myBarChart.draw();
  }

}

class MeterVisualization {

  private padding = 10;
  private gridScale = 20;
  private gridColor = "#eeeeee";
  private color = "#595959";
  private maxValue = 100;

  private readonly canvasActualHeight;
  private readonly canvasActualWidth;
  private readonly barSize;

  constructor(private data: IVolume, private canvas: HTMLCanvasElement, private ctx: CanvasRenderingContext2D) {
    this.canvasActualHeight = this.canvas.height - this.padding * 2;
    this.canvasActualWidth = this.canvas.width - this.padding * 2;
    this.barSize = this.canvasActualWidth / 2 - 5; // 2 bars, padding of 5px
  }

  public updateData(data: IVolume) {
    this.data = data;
  }

  public clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

  private drawBar(ctx: CanvasRenderingContext2D, upperLeftCornerX: number, upperLeftCornerY: number,
                  width: number, height: number, color: string) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(upperLeftCornerX, upperLeftCornerY, width, height);
    ctx.restore();
  }

  public draw() {
    // console.log('drawing..');
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

      //writing grid markers
      // this.ctx.save();
      // this.ctx.fillStyle = this.data.gridColor;
      // this.ctx.font = "bold 10px Arial";
      // this.ctx.fillText(String(gridValue), 0, gridY - 2);
      // this.ctx.restore();

      gridValue += this.gridScale;
    }

    //drawing the volume bars
    this.drawVolume(this.data.left, 0);
    this.drawVolume(this.data.right, 1);
  }

  private drawVolume(value: number, barIndex: number) {
    const barHeight = Math.round( this.canvasActualHeight * value / this.maxValue) ;
    const marginRight = barIndex > 0 ? 10 : 0;
    this.drawBar(
      this.ctx,
      this.padding + barIndex * this.barSize + marginRight,
      this.canvas.height - barHeight - this.padding,
      this.barSize,
      barHeight,
      this.color
    );
  }

}
