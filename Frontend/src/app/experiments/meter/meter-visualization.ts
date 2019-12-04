import { Meter } from 'tone';

export interface IVolume {
  left: number;
  right: number;
}

export class MeterVisualization {

  private currentVolume: IVolume;

  constructor(private meter: Meter, private canvas: HTMLCanvasElement, private ctx: CanvasRenderingContext2D) {
    const ratio =  Math.max(window.devicePixelRatio || 1, 1);
    const w = 80 * ratio;
    const h = 400 * ratio;

    canvas.width = w;
    canvas.height = h;

    this.canvasActualHeight = h - this.padding * 2;
    this.canvasActualWidth = w - this.padding * 2;
    this.barSize = this.canvasActualWidth / 2 - 2.5; // 2 bars, padding of 5px
  }

  private padding = 2;
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

  private static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  private static normalize(value, r1, r2) {
    return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
  }

  public animate() {
    requestAnimationFrame(this.animate.bind(this));

    let meterValue = this.meter.getValue();
    meterValue = MeterVisualization.clamp(meterValue, -100, -10);
    meterValue = MeterVisualization.normalize( meterValue, [ -100, -10 ], [ 0, 100 ] );

    // TODO: Stereo
    const volume: IVolume = {
      left: meterValue,
      right: meterValue
    };
    this.updateData(volume);
    this.clear();
    this.draw();
  }

  public updateData(volume: IVolume) {
    this.currentVolume = volume;
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
    this.drawVolumeBar(this.currentVolume.left, 0);
    this.drawVolumeBar(this.currentVolume.right, 1);
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
    const marginRight = barIndex > 0 ? 5 : 0;
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
