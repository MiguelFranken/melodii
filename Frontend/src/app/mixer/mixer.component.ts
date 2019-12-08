import { Component, OnInit } from '@angular/core';
import { MusicService } from '../generator/library/music.service';

@Component({
  selector: 'mcp-mixer',
  templateUrl: './mixer.component.html',
  styleUrls: ['./mixer.component.scss']
})
export class MixerComponent implements OnInit {

  public masterVolume: number;

  constructor(private musicService: MusicService) { }

  ngOnInit() {
    this.masterVolume = this.musicService.getMasterVolume();
  }

  public input(event) {
    this.musicService.setMasterVolume(event.value);
  }

}
