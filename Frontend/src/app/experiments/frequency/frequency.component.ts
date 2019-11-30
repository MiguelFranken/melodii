import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Gain, MonoSynth, Transport } from 'tone';

class Drum {
  private synth: MonoSynth;
  public analyser: AnalyserNode;
  public gain;
  private _tick;
  public dataArray;
  public bufferLength;

  constructor() {
    this.synth = new MonoSynth();

    this.gain = new Gain(0.4);
    this.analyser = this.synth.context.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.minDecibels = -80;
    this.synth.volume.value = -20;
    this.bufferLength = this.analyser.fftSize;
    this.dataArray = new Uint8Array(this.bufferLength);
    this.synth.connect(this.analyser);
    this.synth.connect(this.gain);
    this.gain.toDestination();
    this._tick = 0;
  }

  tickResolution() {
    // console.log('TICK');
    this.synth.triggerAttackRelease(Math.random() < 0.5 ? "C2" : "E4", "1n");
    this._tick++;
  }

  getData() {
    this.analyser.getByteTimeDomainData(this.dataArray);
    return this.dataArray;
  }
}

@Component({
  selector: 'mcp-frequency',
  templateUrl: './frequency.component.html',
  styleUrls: ['./frequency.component.scss']
})
export class FrequencyComponent implements OnInit {

  @ViewChild('canvas', { static: true })
  CVS: ElementRef<HTMLCanvasElement>;

  private CTX: CanvasRenderingContext2D;

  private drum: Drum;

  constructor() {
    this.drum = new Drum();

    Transport.scheduleRepeat(time => {
      this.drum.tickResolution();
    }, '2n');

    Transport.start();
    this.animate();
  }

  ngOnInit() {
    this.CTX = this.CVS.nativeElement.getContext('2d');
    requestAnimationFrame(this.animate.bind(this));
  }

  public animate() {
    if (!this.CVS || !this.CVS.nativeElement) {
      return;
    }

    requestAnimationFrame(this.animate.bind(this));

    const width = this.CVS.nativeElement.width = window.innerWidth;
    const height = this.CVS.nativeElement.height = window.innerHeight;

    this.CTX.fillStyle = 'transparent';
    this.CTX.fillRect(0, 0, width, height);

    const data = [];
    data[0] = this.drum.getData();

    const len = this.drum.bufferLength;
    const stepX = width / len;
    const stepY = height;
    const maxH = height * 0.2;
    let cy = stepY * 0.5;

    this.CTX.lineWidth = 3;
    this.CTX.lineJoin = 'round';
    this.CTX.lineCap = 'round';
    this.CTX.strokeStyle = '#373737';

    for (let j = 0; j < 1; j++) {
      let x = stepX * 0.5;
      this.CTX.beginPath();
      for (let i = 0; i < len; i++) {
        const rat = (data[j][i] - 128.0) / 128.0;
        const y = rat * maxH + cy;
        if (i === 0 && j === 0) {
          this.CTX.moveTo(x, y);
        } else {
          this.CTX.lineTo(x, y);
        }
        x += stepX;
      }
      cy += stepY;
      this.CTX.stroke();
    }
  }

}
