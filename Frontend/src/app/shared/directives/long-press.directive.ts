import {
  Directive,
  Output,
  EventEmitter,
  HostBinding,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[longPress]'
})
export class LongPressDirective {
  pressing: boolean;
  _longPressing: boolean;
  timeout: any;
  interval: any;
  pageX: number;
  pageY: number;

  @Output()
  longPress = new EventEmitter();

  @Output()
  longPressing = new EventEmitter();

  @HostBinding('class.press')
  get press() { return this.pressing; }

  @HostListener('touchstart', ['$event'])
  onMouseDown(event) {
    this.pageX = event.pageX;
    this.pageY = event.pageY;
    this.pressing = true;
    this._longPressing = false;
    this.timeout = setTimeout(() => {
      this._longPressing = true;
      this.longPress.emit(event);
      this.interval = setInterval(() => {
        this.longPressing.emit(event);
      }, 50);
    }, 500);
  }

  @HostListener('touchmove', ['$event'])
  onMove(_) {
    clearTimeout(this.timeout);
    clearInterval(this.interval);
    this._longPressing = false;
    this.pressing = false;
  }

  @HostListener('touchend')
  endPress() {
    clearTimeout(this.timeout);
    clearInterval(this.interval);
    this._longPressing = false;
    this.pressing = false;
  }
}
