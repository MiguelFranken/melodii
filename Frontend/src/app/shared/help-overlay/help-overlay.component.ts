import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mcp-help-overlay',
  templateUrl: './help-overlay.component.html',
  styleUrls: ['./help-overlay.component.scss']
})
export class HelpOverlayComponent implements OnInit {

  text;
  overlayID;
  close;

  constructor() { }

  ngOnInit() {
  }

  dismiss() {
    this.close(); // auto binded
  }

}
