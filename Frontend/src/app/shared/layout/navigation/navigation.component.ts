import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NavigationService } from "./navigation.service";
import { Observable } from "rxjs";
import { OutsidePlacement, RelativePosition, Toppy } from 'toppy';
import { Logger } from '@upe/logger';
import { GeneratorCommunicationService } from '../../../generator/library/generator-communication.service';
import { SocketServer } from '../../../generator/library/socket-server';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  private logger: Logger = new Logger({ name: 'NavigationComponent', flags: ['component'] });

  public isClosed: Observable<boolean>;

  @ViewChild('el', { static: true, read: ElementRef })
  el: ElementRef;

  @ViewChild('tpl', { static: true })
  tpl: TemplateRef<any>;

  private soundMenuOverlay;

  public useGenerator = true;
  public useDirectCommunication = true;
  public hasSound = true;

  constructor(
    private navigationService: NavigationService,
    private socketServer: SocketServer,
    private toppy: Toppy,
    private directCommunicationService: GeneratorCommunicationService) { }

  ngOnInit() {
    this.isClosed = this.navigationService.getIsClosedObservable();
    this.initSoundMenu();
  }

  public switchSound() {
    // TODO
  }

  public switchGenerator() {
    this.useGenerator = !this.useGenerator;

    if (this.useGenerator) {
      this.socketServer.reconnect();
    } else {
      this.socketServer.disconnect();
    }
  }

  public switchDirectCommunication() {
    this.useDirectCommunication = !this.useDirectCommunication;
    this.directCommunicationService.switchDirectCommunication();
  }

  private initSoundMenu() {
    const position = new RelativePosition({
      placement: OutsidePlacement.BOTTOM_LEFT,
      src: this.el.nativeElement
    });

    this.soundMenuOverlay = this.toppy
      .position(position)
      .config({
        closeOnDocClick: true
      })
      .content(this.tpl, { name: 'Johny' })
      .create();

    this.logger.info('Initialized sound menu');
  }

  public openSoundMenu() {
    this.soundMenuOverlay.open();
  }

}
