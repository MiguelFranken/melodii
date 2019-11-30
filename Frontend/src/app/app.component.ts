import { Component } from '@angular/core';
import { MusicService } from './generator/library/musicService';
import { container } from './generator/library/decorator/container';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(musicService: MusicService) {
    container.addSingletonDependency(MusicService, musicService);
  }

}
