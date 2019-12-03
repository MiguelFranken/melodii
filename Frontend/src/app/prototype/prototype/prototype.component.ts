import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BehaviorSubject, interval, Observable, Subject, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatMenuTrigger } from '@angular/material/menu';
import { NavigationService } from '../../shared/layout/navigation/navigation.service';
import { Matrix } from './matrix';
import { Row } from './row';
import { RowButton } from './row-button';
import { OutsidePlacement, RelativePosition, Toppy } from 'toppy';
import { Logger } from '@upe/logger';
import { Chain, HelpOverlayService, Overlay, OverlayElements } from '../../shared/help-overlay/help-overlay.service';
import { GeneratorCommunicationService } from '../../generator/library/generator-communication.service';
import { NotYetImplementedService } from '../../not-yet-implemented.service';
import { IOSCMessage } from '../../shared/osc/osc-message';

const NOTES_MAJOR_C = [
  'C',
  'D',
  'E',
  'F',
  'G',
  'A',
  'B'
];

const DEFAULT_BPM = 80;

const NUMBER_OF_COLUMNS = 8;
const NUMBER_OF_ROWS = 30;

@Component({
  selector: 'app-prototype',
  templateUrl: './prototype.component.html',
  styleUrls: ['./prototype.component.scss']
})
export class PrototypeComponent implements OnInit, OnDestroy {

  private logger: Logger = new Logger({ name: 'PrototypeComponent', flags: ['component'] });

  public useReverbOnMaster = true;
  public usePingPongDelayOnMaster = true;
  public useReverbOnSnare = false;
  public usePingPongDelayOnSnare = false;

  public height = '100%';

  private matrixCollection: Matrix[] = [];
  private matrixCollectionIndex = 0;
  public matrix: Matrix;

  public showVelocity = false;

  private _bpm: number = DEFAULT_BPM;

  private subject = new Subject();
  private interval;

  private msPerBeat: number = 1000 * 0.5 * (60 / DEFAULT_BPM); // TODO MF: different default

  public temp = 0;

  private playSubscription: Subscription;

  public showRowNames = true;

  public isClosedNavigation: Observable<boolean>;

  //region Overlay References
  //region Element Refs
  @ViewChild('el', { static: true, read: ElementRef })
  el: ElementRef;

  @ViewChild('velocityButtonElement', { static: true, read: ElementRef })
  velocityButtonElement: ElementRef;

  @ViewChild('bpmSliderElement', { static: true, read: ElementRef })
  bpmSliderElement: ElementRef;

  @ViewChild('playButtonElement', { static: true, read: ElementRef })
  playButtonElement: ElementRef;

  @ViewChild('stopButtonElement', { static: true, read: ElementRef })
  stopButtonElement: ElementRef;

  @ViewChild('sliderElement', { static: false, read: ElementRef })
  sliderElement: ElementRef;

  @ViewChild('helpButton', { static: false, read: ElementRef })
  helpButtonElement: ElementRef;

  @ViewChild('effectButton', { static: false, read: ElementRef })
  effectButtonElement: ElementRef;

  @ViewChild('rowButtonElement', { static: false, read: ElementRef })
  rowButtonElement: ElementRef;
  //endregion

  //region Template Refs
  @ViewChild('tpl', { static: true })
  tpl: TemplateRef<any>;

  @ViewChild('helpMenuTemplate', { static: true })
  helpMenuTemplate: TemplateRef<any>;

  @ViewChild('effectMenuTemplate', { static: true })
  effectMenuTemplate: TemplateRef<any>;

  @ViewChild('helpTemplate', { static: true })
  helpTemplate: TemplateRef<any>;
  //endregion

  //region Overlay instances
  /**
   * Overlay used to select the current instrument,
   * i.e. selection of on of the available matrices
   */
  private instrumentSelectionOverlay;
  private helpMenuOverlay: Overlay;
  private effectMenuOverlay: Overlay;
  //endregion
  //endregion

  public isInExpandedMode = true;

  private isInFoldMode = false;

  @ViewChild(MatMenuTrigger, {static: false})
  contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  private clicked = false;

  constructor(
    private navigationService: NavigationService,
    private communicationService: GeneratorCommunicationService,
    private toppy: Toppy,
    private helpOverlayService: HelpOverlayService,
    private notYetImplementedService: NotYetImplementedService) {
  }

  //region Velocity
  public switchVelocity() {
    this.showVelocity = !this.showVelocity;
  }

  setVelocity(event, button: RowButton) {
    button.velocity = event.value;
    this.logger.debug('Setting velocity', button.velocity);
  }

  public increaseVelocity(event: MouseEvent, button: RowButton) {
    event.stopPropagation();
    button.velocity += 10;
    this.logger.info(`Increased velocity to ${button.velocity}`);
  }

  public decreaseVelocity(event: MouseEvent, button: RowButton) {
    event.stopPropagation();
    button.velocity -= 10;
    this.logger.info(`Decreased velocity to ${button.velocity}`);
  }

  public onTapOnVelocitySlider() {
    this.clicked = true;
  }
  //endregion

  //region Row Expansion
  public switchRowExpansionMode(row: Row) {
    row.isExpanded = !row.isExpanded;
  }

  public switchAllExpanded() {
    this.isInExpandedMode = !this.isInExpandedMode;
    for (let i = 0; i < NUMBER_OF_ROWS; i++) {
      this.matrix.rows[i].isExpanded = this.isInExpandedMode;
    }
  }
  //endregion

  //region BPM
  changeBpm(event) {
    this.bpm = event.value;
  }

  public set bpm(bpm: number) {
    this._bpm = bpm;
    this.msPerBeat = 1000 * 0.5 * (60 / bpm);
  }

  public get bpm(): number {
    return this._bpm;
  }

  public updateMatrix() {
    this.subject.next(this.msPerBeat);
  }
  //endregion

  //region Help Overlays
  //region Help Overlays
  public showHelp() {
    this.initHelpMenuOverlay();
    this.helpMenuOverlay.open();
  }

  public showEffectMenu() {
    this.initEffectMenuOverlay();
    this.effectMenuOverlay.open();
  }

  public showVelocityHelp() {
    this.helpOverlayService.triggerChain('velocity');
  }

  public showTutorial() {
    console.log('Show tutorial');
    this.helpOverlayService.triggerChain('tutorial');
  }

  private initEffectMenuOverlay() {
    const position = new RelativePosition({
      placement: OutsidePlacement.BOTTOM_LEFT,
      src: this.effectButtonElement.nativeElement
    });

    this.effectMenuOverlay = this.toppy
      .position(position)
      .config({
        closeOnDocClick: true
      })
      .content(this.effectMenuTemplate, { name: 'Johny' })
      .create();

    this.logger.info('Initialized help menu overlay');
  }

  private initHelpMenuOverlay() {
    const position = new RelativePosition({
      placement: OutsidePlacement.BOTTOM_LEFT,
      src: this.helpButtonElement.nativeElement
    });

    this.helpMenuOverlay = this.toppy
      .position(position)
      .config({
        closeOnDocClick: true
      })
      .content(this.helpMenuTemplate, { name: 'Johny' })
      .create();

    this.logger.info('Initialized help menu overlay');
  }
  //endregion

  private initOverlays() {
    this.initInstrumentSelectionMenu();
  }
  //endregion

  //region Instrument Selection Menu
  private initInstrumentSelectionMenu() {
    const position = new RelativePosition({
      placement: OutsidePlacement.BOTTOM_LEFT,
      src: this.el.nativeElement
    });

    this.instrumentSelectionOverlay = this.toppy
      .position(position)
      .config({
        closeOnDocClick: true
      })
      .content(this.tpl, { name: 'Johny' })
      .create();

    this.logger.info('Initialized instrument selection menu');
  }

  public openInstrumentSelectionMenu() {
    this.instrumentSelectionOverlay.open();
  }

  public switchMatrix(matrix: Matrix, index: number) {
    this.matrix = matrix;
    this.matrixCollectionIndex = index;
  }
  //endregion

  private addElements() {
    const subject: BehaviorSubject<OverlayElements[]> = this.helpOverlayService.getSubject();
    this.helpOverlayService.getOutputObservable().subscribe(() => {
      subject.next([
        {
          chainID: 'velocity',
          elements: [
            { overlayID: "showRowButtonOverlay", element: this.rowButtonElement },
            { overlayID: "showVelocityButtonOverlay", element: this.velocityButtonElement },
            { overlayID: "showSliderOverlay", element: this.sliderElement },
          ]
        },
        {
          chainID: 'tutorial',
          elements: [
            { overlayID: "showRowButtonOverlay", element: this.rowButtonElement },
            { overlayID: "playButtonOverlay", element: this.playButtonElement },
            { overlayID: "stopButtonOverlay", element: this.stopButtonElement },
            { overlayID: "bpmSliderOverlay", element: this.bpmSliderElement },
          ]
        }
      ]);
    });
  }

  private createTutorialChain() {
    const chain: Chain = {
      chainID: 'tutorial',
      entries: [
        {
          overlayID: "showRowButtonOverlay",
          preCondition: () => !this.hasActivatedButton(),
          text: "Tap here to add a note",
          event: "click"
        },
        {
          overlayID: "playButtonOverlay",
          preCondition: () => true,
          text: "Tap here to start playback",
          event: "click"
        },
        {
          overlayID: "bpmSliderOverlay",
          preCondition: () => true,
          text: "Slide to change the BPM (Beats per Minute)",
          event: "touchmove"
        },
        {
          overlayID: "stopButtonOverlay",
          preCondition: () => true,
          text: "Press here to stop playback",
          event: "click"
        },
      ]
    };
    this.helpOverlayService.addChain(chain);
  }

  private createVelocityChain() {
    const chain: Chain = {
      chainID: 'velocity',
      entries: [
        {
          overlayID: "showRowButtonOverlay",
          preCondition: () => !this.hasActivatedButton(),
          text: "Tap here to add a note",
          event: "click"
        },
        {
          overlayID: "showVelocityButtonOverlay",
          preCondition: () => !this.showVelocity,
          text: "Open the velocity sliders",
          event: "click"
        },
        {
          overlayID: "showSliderOverlay",
          preCondition: () => true,
          text: "Slide to change the velocity",
          event: "touchmove"
        }
      ]
    };
    this.helpOverlayService.addChain(chain);
  }

  ngOnInit() {
    this.addElements();
    this.createTutorialChain();
    this.createVelocityChain();
    this.initOverlays();

    this.isClosedNavigation = this.navigationService.getIsClosedObservable();
    this.isClosedNavigation.subscribe(value => {
      if (value) {
        this.height = '100%';
      } else {
        this.height = '99.99%'; // safari height fix
      }
    });

    this.interval = this.subject.pipe(switchMap((period: number) => interval(period)));

    // create matrices
    this.createMatrixDrums();
    this.createMatrixPiano();

    this.matrix = this.matrixCollection[this.matrixCollectionIndex];
  }

  /**
   * Removes all entries of the currently displayed matrix
   */
  public clearMatrix() {
    for (let i = 0; i < NUMBER_OF_ROWS; i++) {
      for (let y = 0; y < NUMBER_OF_COLUMNS; y++) {
        this.matrix.rows[i].buttons[y].isActive = false;
      }
    }
  }

  public hasActivatedButton(): boolean {
    for (let i = 0; i < 3; i++) {
      for (let y = 0; y < NUMBER_OF_COLUMNS; y++) {
        if (this.matrix.rows[i].buttons[y].isActive) {
          this.logger.debug('Has activated button');
          return true;
        }
      }
    }
    this.logger.debug('Has NO activated button');
    return false;
  }

  /**
   * Selects the next available matrix from the matrix collection as the current matrix.
   */
  public nextMatrix() {
    this.matrixCollectionIndex = (this.matrixCollectionIndex + 1) % this.matrixCollection.length;
    this.matrix = this.matrixCollection[this.matrixCollectionIndex];
    this.logger.info('Switched to next matrix', this.matrix);
  }

  /**
   * Selects the previous available matrix from the matrix collection as the current matrix.
   */
  public previousMatrix() {
    if (this.matrixCollectionIndex === 0) {
      this.matrixCollectionIndex = this.matrixCollection.length - 1;
    } else {
      this.matrixCollectionIndex = (this.matrixCollectionIndex - 1) % this.matrixCollection.length;
    }
    this.matrix = this.matrixCollection[this.matrixCollectionIndex];
    this.logger.info('Switched to previous matrix', this.matrix);
  }

  //region Folding
  getNonFoldedRows() {
    return this.matrix.rows.filter((row: Row) => {
      return !row.isFolded;
    });
  }

  switchFold() {
    if (this.isInFoldMode) {
      for (let i = 0; i < NUMBER_OF_ROWS; i++) {
        this.matrix.rows[i].isFolded = false;
      }
      this.isInFoldMode = false;
    } else {
      for (let i = 0; i < NUMBER_OF_ROWS; i++) {
        this.matrix.rows[i].isFolded = true;
        for (let y = 0; y < NUMBER_OF_COLUMNS; y++) {
          if (this.matrix.rows[i].buttons[y].isActive) {
            this.matrix.rows[i].isFolded = false;
          }
        }
      }
      this.isInFoldMode = true;
    }
  }
  //endregion

  //region Matrix Creation
  //region Drum Matrix
  private createKickRow(): Row {
    const rowArray: RowButton[] = [];

    for (let y = 0; y < NUMBER_OF_COLUMNS; y++) {
      const kickButton = new RowButton();
      kickButton.setOSCMessage({
        address: '/drums/kick',
        args: [
          {
            'type': "s",
            value: "8n"
          },
          {
            'type': "f",
            value: kickButton.velocity
          }
        ],
        info: {
          address: '/play_note',
          family: 'IPv4',
          port: 80,
          size: 1,
        }
      });
      rowArray.push(kickButton);
    }

    return new Row(rowArray, 'Kick');
  }

  private createSnareRow(): Row {
    const rowArray: RowButton[] = [];

    for (let y = 0; y < NUMBER_OF_COLUMNS; y++) {
      const snareButton = new RowButton();
      snareButton.setOSCMessage({
        address: '/drums/snare/play',
        args: [
          {
            'type': "s",
            value: "8n"
          },
          {
            'type': "f",
            value: snareButton.velocity
          }
        ],
        info: {
          address: '/play_note',
          family: 'IPv4',
          port: 80,
          size: 1,
        }
      });
      rowArray.push(snareButton);
    }

    return new Row(rowArray, 'Snare');
  }

  private createHihatRow(): Row {
    const rowArray: RowButton[] = [];

    for (let y = 0; y < NUMBER_OF_COLUMNS; y++) {
      // kick
      const hihatButton = new RowButton();
      hihatButton.setOSCMessage({
        address: '/drums/hihat',
        args: [
          {
            'type': "s",
            value: "64n"
          },
          {
            'type': "f",
            value: hihatButton.velocity
          }
        ],
        info: {
          address: '/play_note',
          family: 'IPv4',
          port: 80,
          size: 1,
        }
      });
      rowArray.push(hihatButton);
    }

    return new Row(rowArray, 'Hihat');
  }

  private createMatrixDrums() {
    const matrix: Matrix = new Matrix();
    matrix.rows.push(this.createKickRow());
    matrix.rows.push(this.createHihatRow());
    matrix.rows.push(this.createSnareRow());
    matrix.name = 'Drums';
    this.matrixCollection.push(matrix);
    this.logger.info("Created matrix for instrument: 'Drums'", matrix);
  }
  //endregion

  //region Piano Matrix
  private createMatrixPiano() {
    const matrix: Matrix = new Matrix();
    for (let i = 0; i < NUMBER_OF_ROWS; i++) {
      const rowArray: RowButton[] = [];

      const randomNote = NOTES_MAJOR_C[i % 7];
      const note = randomNote + (Math.floor(i / 7));

      for (let y = 0; y < NUMBER_OF_COLUMNS; y++) {
        const button = new RowButton(note);
        button.setOSCMessage({
          address: '/piano/play_note',
          args: [
            {
              'type': 's',
              value: note // note
            },
            {
              'type': 's',
              value: '8n' // duration
            },
            {
              'type': 'f',
              value: button.velocity // velocity
            },
          ],
          info: {
            address: '/play_note',
            family: 'IPv4',
            port: 80,
            size: 1,
          }
        });
        rowArray.push(button);
      }

      const row: Row = new Row(rowArray);
      row.name = note;

      matrix.rows.push(row);
    }
    matrix.name = 'Piano';
    this.matrixCollection.push(matrix);
    this.logger.info("Created matrix for instrument: 'Piano'", matrix);
  }
  //endregion
  //endregion

  /**
   * Stops to play the notes on the matrix
   */
  public stop() {
    if (this.playSubscription) {
      this.playSubscription.unsubscribe();

      for (const rows of this.matrix.rows) {
        const oldButton: RowButton = rows.buttons[this.temp];
        oldButton.isPlayed = false;
      }

      this.temp = 0;
    }
  }

  /**
   * Starts to play the notes on the matrix from the beginning.
   * If the matrix is already played at this moment, it is stopped and starts again bon,
   */
  public start() {
    this.stop();

    for (const rows of this.matrix.rows) {
      const oldButton: RowButton = rows.buttons[0];
      oldButton.isPlayed = true;

      if (oldButton.isActive) {
        this.communicationService.sendMessage(oldButton.oscMessage);
      }
    }

    this.playSubscription = this.interval.subscribe(_ => {
      const newTemp = (this.temp + 1) % NUMBER_OF_COLUMNS;

      for (const rows of this.matrix.rows) {
        const oldButton: RowButton = rows.buttons[this.temp];
        oldButton.isPlayed = false;

        const newButton: RowButton = rows.buttons[(this.temp + 1) % NUMBER_OF_COLUMNS];
        newButton.isPlayed = true;

        if (newButton.isActive) {
          this.communicationService.sendMessage(newButton.oscMessage);
        }
      }
      this.temp = newTemp;
    });

    this.subject.next(this.msPerBeat);
  }

  /**
   * Activates or deactivates a button of the matrix. If the button is active,then a message is generated
   * from the button at the right time, which leads to the output of a sound in the music generator.
   */
  public switchRowButtonActivationStatus(event, rowButton: RowButton) {
    if (event.srcElement.nodeName.toLowerCase() === 'mat-slider' || this.clicked) {
      this.clicked = false;
    } else {
      rowButton.isActive = !rowButton.isActive;
    }
  }

  //region Context Menu For Row Buttons
  /**
   * A long press activates the context menu with further setting options for an entry in the matrix.
   */
  onLongPress(event: MouseEvent, button: RowButton) {
    event.preventDefault();

    if (button.isActive) {
      this.contextMenuPosition.x = event.pageX + 'px';
      this.contextMenuPosition.y = event.pageY + 'px';
      this.contextMenu.menuData = {button};
      this.contextMenu.openMenu();
    }

    this.logger.info('Performed long press on button', button);
  }

  /**
   * Opens the context menu of a specific entry of the matrix specified by the row button.
   */
  onContextMenu(event: MouseEvent, button: RowButton) {
    event.preventDefault();

    if (button.isActive) {
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { button };
      this.contextMenu.openMenu();
    }
  }
  //endregion

  /**
   * Hides the main navigation so that there is more space for the matrix
   */
  public switchNavigation() {
    this.navigationService.switchNavigation();
  }

  //region Sound Effects
  public switchReverbOnMaster() {
    this.useReverbOnMaster = !this.useReverbOnMaster;

    const oscMessage: IOSCMessage = {
      address: '/effect/reverb',
      args: [
        { type: 'i', value: this.useReverbOnMaster ? 1 : 0 }
      ],
      info: {
        address: '/play_note',
        family: 'IPv4',
        port: 80,
        size: 1,
      }
    };

    this.communicationService.sendMessage(oscMessage);

    this.logger.debug('Switched reverb effect on master');
  }

  public switchPingPongDelayOnMaster() {
    this.usePingPongDelayOnMaster = !this.usePingPongDelayOnMaster;

    const oscMessage: IOSCMessage = {
      address: '/effect/pingpongdelay',
      args: [
        { type: 'i', value: this.usePingPongDelayOnMaster ? 1 : 0 }
      ],
      info: {
        address: '/play_note',
        family: 'IPv4',
        port: 80,
        size: 1,
      }
    };

    this.communicationService.sendMessage(oscMessage);

    this.logger.debug('Switched PingPongDelay on master');
  }

  public switchReverbOnSnare() {
    this.useReverbOnSnare = !this.useReverbOnSnare;

    const oscMessage: IOSCMessage = {
      address: '/drums/snare/effect/reverb',
      args: [
        { type: 'i', value: this.useReverbOnSnare ? 1 : 0 }
      ],
      info: {
        address: '/play_note',
        family: 'IPv4',
        port: 80,
        size: 1,
      }
    };

    this.communicationService.sendMessage(oscMessage);

    this.logger.debug('Switched reverb effect on snare');
  }

  public switchPingPongDelayOnSnare() {
    this.usePingPongDelayOnSnare = !this.usePingPongDelayOnSnare;

    const oscMessage: IOSCMessage = {
      address: '/drums/snare/effect/pingpongdelay',
      args: [
        { type: 'i', value: this.usePingPongDelayOnSnare ? 1 : 0 }
      ],
      info: {
        address: '/play_note',
        family: 'IPv4',
        port: 80,
        size: 1,
      }
    };

    this.communicationService.sendMessage(oscMessage);

    this.logger.debug('Switched PingPongDelay on snare');
  }
  //endregion

  // TODO: Das sollte nur ein Workaround sein!
  ngOnDestroy() {
    // this.stop();
  }

  public notYetImplemented() {
    this.notYetImplementedService.openSnackbar();
  }

}
