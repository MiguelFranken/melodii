import { Component, OnInit } from '@angular/core';
import { MusicService } from '../generator/library/music.service';
import { Volume } from "tone";
import { IOSCMessage } from "../shared/osc/osc-message";
import { GeneratorCommunicationService } from "../generator/library/generator-communication.service";

@Component({
  selector: 'mcp-mixer',
  templateUrl: './mixer.component.html',
  styleUrls: ['./mixer.component.scss']
})
export class MixerComponent implements OnInit {

  public masterVolume: number;
  public arcVolume: number;
  public boxVolume: number;
  public matVolume: number;
  public celloVolume: number;
  public drumsVolume: number;

  constructor(private musicService: MusicService, private communicationService: GeneratorCommunicationService) { }

  ngOnInit() {
    this.masterVolume = this.musicService.getMasterVolume();
    this.arcVolume = MixerComponent.getVolume(this.musicService.getVolumeNode('arc'));
    this.boxVolume = MixerComponent.getVolume(this.musicService.getVolumeNode('box'));
    this.matVolume = MixerComponent.getVolume(this.musicService.getVolumeNode('mat'));
    this.celloVolume = MixerComponent.getVolume(this.musicService.getVolumeNode('cello'));
  }

  private static getVolume(node: Volume): number {
    return node.volume.value;
  }

  public inputMaster(event) {
    // this.musicService.setMasterVolume(event.value);

    const oscMessage: IOSCMessage = {
      address: '/volume/master',
      args: [
        { type: 'i', value: event.value }
      ],
      info: null
    };

    this.communicationService.sendMessage(oscMessage);
  }

  public inputMat(event) {
    // this.musicService.setVolume('mat', event.value);

    const oscMessage: IOSCMessage = {
      address: '/volume/instrument',
      args: [
        { type: 's', value: 'mat' },
        { type: 'i', value: event.value }
      ],
      info: {
        address: '/play_note',
        family: 'IPv4',
        port: 80,
        size: 1,
      }
    };

    this.communicationService.sendMessage(oscMessage);
  }

  public inputArc(event) {
    // this.musicService.setVolume('arc', event.value);

    const oscMessage: IOSCMessage = {
      address: '/volume/instrument',
      args: [
        { type: 's', value: 'arc' },
        { type: 'i', value: event.value }
      ],
      info: {
        address: '/play_note',
        family: 'IPv4',
        port: 80,
        size: 1,
      }
    };

    this.communicationService.sendMessage(oscMessage);
  }

  public inputBox(event) {
    // this.musicService.setVolume('box', event.value);

    const oscMessage: IOSCMessage = {
      address: '/volume/instrument',
      args: [
        { type: 's', value: 'box' },
        { type: 'i', value: event.value }
      ],
      info: {
        address: '/play_note',
        family: 'IPv4',
        port: 80,
        size: 1,
      }
    };

    this.communicationService.sendMessage(oscMessage);
  }

  public inputCello(event) {
    // this.musicService.setVolume('cello', event.value);

    const oscMessage: IOSCMessage = {
      address: '/volume/instrument',
      args: [
        { type: 's', value: 'cello' },
        { type: 'i', value: event.value }
      ],
      info: {
        address: '/play_note',
        family: 'IPv4',
        port: 80,
        size: 1,
      }
    };

    this.communicationService.sendMessage(oscMessage);
  }

}
