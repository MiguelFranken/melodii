import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NavigationService } from "./navigation.service";
import { Observable, timer } from 'rxjs';
import { OutsidePlacement, RelativePosition, Toppy } from 'toppy';
import { Logger } from '@upe/logger';
import { GeneratorCommunicationService } from '../../../generator/library/generator-communication.service';
import { LogService } from '../../../generator/log/log.service';
import { NotYetImplementedService } from '../../../not-yet-implemented.service';

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

  public useDirectCommunication = true;
  public hasSound = true;
  public hasReceivedMessage = false;
  public showMessageIndicator = true;

  constructor(
    private navigationService: NavigationService,
    private toppy: Toppy,
    private generatorCommunicationService: GeneratorCommunicationService,
    private logService: LogService,
    private notYetImplementedService: NotYetImplementedService) { }

  ngOnInit() {
    this.isClosed = this.navigationService.getIsClosedObservable();
    this.initSoundMenu();

    this.logService.getEventObservable().subscribe(() => {
      if (this.showMessageIndicator) {
        this.hasReceivedMessage = true;
        timer(300).subscribe(() => {
          this.hasReceivedMessage = false;
        });
      }
    });
  }

  public switchSound() {
    // TODO
    this.notYetImplementedService.openSnackbar();
  }

  public switchMessageIndicator() {
    this.showMessageIndicator = !this.showMessageIndicator;
  }

  public switchDirectCommunication() {
    this.useDirectCommunication = !this.useDirectCommunication;
    this.generatorCommunicationService.switchDirectCommunication();
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
