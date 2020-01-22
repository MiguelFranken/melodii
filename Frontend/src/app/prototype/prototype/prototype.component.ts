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
import { InstrumentName } from '../../generator/library/types';

// TODO MF: Tonal npm package nutzen
enum ChordQuality {
  MAJOR,
  MINOR
}

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
const NUMBER_OF_ROWS_PIANO_INSTRUMENT = 30;

let useReverbOnMaster = false;
let usePingPongDelayOnMaster = false;
let useEQOnMaster = false;
let useEQLowOnMaster = false;
let useEQMidOnMaster = false;
let useEQHighOnMaster = false;
let isPlaying = false;
const useReverbMap: Map<InstrumentName, boolean> = new Map();
const usePingPongDelayMap: Map<InstrumentName, boolean> = new Map();
const matrixCollection: Matrix[] = [];
let matrixCollectionIndex = 0;
let matrix: Matrix;
let showVelocity = false;
let _bpm: number = DEFAULT_BPM;
let msPerBeat: number = 1000 * 0.5 * (60 / DEFAULT_BPM); // TODO MF: different default
let currentPlayedColumnIndex = 0;
let isInExpandedMode = true;
let isInFoldMode = false;
const subject = new Subject();
let _interval;
let playSubscription: Subscription;

@Component({
  selector: 'app-prototype',
  templateUrl: './prototype.component.html',
  styleUrls: ['./prototype.component.scss']
})
export class PrototypeComponent implements OnInit, OnDestroy {

  public showRowNames = true;

  private logger: Logger = new Logger({ name: 'PrototypeComponent', flags: ['component'] });

  public height = '100%';

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

  @ViewChild('presetButton', { static: false, read: ElementRef })
  presetButtonElement: ElementRef;

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

  @ViewChild('presetMenuTemplate', { static: true })
  presetMenuTemplate: TemplateRef<any>;

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
  private instrumentSelectionOverlay: Overlay;
  private helpMenuOverlay: Overlay;
  private effectMenuOverlay: Overlay;
  private presetMenuOverlay: Overlay;
  //endregion
  //endregion

  //region Context Menu Attributes
  @ViewChild('contextMenuTrigger', {static: false})
  contextMenu: MatMenuTrigger;

  @ViewChild('effectContextMenuTrigger', {static: false})
  effectContextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  effectContextMenuPosition = { x: '0px', y: '0px' };
  //endregion

  private clicked = false;

  constructor(
    private navigationService: NavigationService,
    private communicationService: GeneratorCommunicationService,
    private toppy: Toppy,
    private helpOverlayService: HelpOverlayService,
    private notYetImplementedService: NotYetImplementedService) {
    useReverbMap.set('hihat', false);
    useReverbMap.set('kick', false);
    useReverbMap.set('snare', false);
    usePingPongDelayMap.set('hihat', false);
    usePingPongDelayMap.set('kick', false);
    usePingPongDelayMap.set('snare', false);
  }

  public getMatrixCollection() {
    return matrixCollection;
  }

  public getIsInExpandedMode() {
    return isInExpandedMode;
  }

  public useReverbOnMaster() {
    return useReverbOnMaster;
  }

  public usePingPongDelayOnMaster() {
    return usePingPongDelayOnMaster;
  }

  public useEQOnMaster() {
    return useEQOnMaster;
  }

  public useEQLowOnMaster() {
    return useEQLowOnMaster;
  }

  public useEQMidOnMaster() {
    return useEQMidOnMaster;
  }

  public useEQHighOnMaster() {
    return useEQHighOnMaster;
  }

  public getShowVelocity() {
    return showVelocity;
  }

  public getMatrix() {
    return matrix;
  }

  //region Velocity
  public switchVelocity() {
    showVelocity = !showVelocity;
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
    isInExpandedMode = !isInExpandedMode;

    matrix.rows.forEach((row) => {
      row.isExpanded = isInExpandedMode;
    });
  }
  //endregion

  //region BPM
  changeBpm(event) {
    this.bpm = event.value;
  }

  public set bpm(bpm: number) {
    _bpm = bpm;
    msPerBeat = 1000 * 0.5 * (60 / bpm);
  }

  public get bpm(): number {
    return _bpm;
  }

  public updateMatrix() {
    subject.next(msPerBeat);
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
    this.logger.info('Show tutorial');
    this.helpOverlayService.triggerChain('tutorial');
  }

  public openPresetMenu() {
    this.initPresetMenuOverlay();
    this.presetMenuOverlay.open();
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

  private initPresetMenuOverlay() {
    const position = new RelativePosition({
      placement: OutsidePlacement.BOTTOM_LEFT,
      src: this.presetButtonElement.nativeElement
    });

    this.presetMenuOverlay = this.toppy
      .position(position)
      .config({
        closeOnDocClick: true
      })
      .content(this.presetMenuTemplate, { name: 'Johny' })
      .create();

    this.logger.info('Initialized preset menu overlay');
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
    matrix = matrix;
    matrixCollectionIndex = index;
  }
  //endregion

  //region Tutorial chain
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
          preCondition: () => !showVelocity,
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
  //endregion

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

    _interval = subject.pipe(switchMap((period: number) => interval(period)));
    this.logger.debug("_interval", { interval: _interval });

    // create matrices
    this.createMatrixDrums();
    this.createMatrixPiano();

    matrix = matrixCollection[matrixCollectionIndex];
  }

  /**
   * Removes all entries of the currently displayed matrix
   */
  public clearMatrix() {
    matrix.rows.forEach((row) => {
      row.buttons.forEach((button) => {
        button.isActive = false;
      });
    });
  }

  public hasActivatedButton(): boolean {
    for (let i = 0; i < 3; i++) {
      for (let y = 0; y < NUMBER_OF_COLUMNS; y++) {
        if (matrix.rows[i].buttons[y].isActive) {
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
    matrixCollectionIndex = (matrixCollectionIndex + 1) % matrixCollection.length;
    matrix = matrixCollection[matrixCollectionIndex];

    if (isPlaying) {
      for (const row of matrix.rows) {
        row.buttons.forEach((button: RowButton, columnIndex: number) => {
          button.isPlayed = columnIndex === currentPlayedColumnIndex;
        });
      }
    } else {
      for (const row of matrix.rows) {
        row.buttons.forEach((button: RowButton, columnIndex: number) => {
          button.isPlayed = false;
          button.isActive = false;
        });
      }
    }

    this.logger.info('Switched to next matrix', matrix);
  }

  /**
   * Selects the previous available matrix from the matrix collection as the current matrix.
   */
  public previousMatrix() {
    if (matrixCollectionIndex === 0) {
      matrixCollectionIndex = matrixCollection.length - 1;
    } else {
      matrixCollectionIndex = (matrixCollectionIndex - 1) % matrixCollection.length;
    }
    matrix = matrixCollection[matrixCollectionIndex];

    if (isPlaying) {
      for (const row of matrix.rows) {
        row.buttons.forEach((button: RowButton, columnIndex: number) => {
          button.isPlayed = columnIndex === currentPlayedColumnIndex;
        });
      }
    } else {
      for (const row of matrix.rows) {
        row.buttons.forEach((button: RowButton, columnIndex: number) => {
          button.isPlayed = false;
          button.isActive = false;
        });
      }
    }

    this.logger.info('Switched to previous matrix', matrix);
  }

  //region Folding
  getNonFoldedRows() {
    return matrix.rows.filter((row: Row) => {
      return !row.isFolded;
    });
  }

  switchFold() {
    if (isInFoldMode) {
      matrix.rows.forEach((row) => {
        row.isFolded = false;
      });
      isInFoldMode = false;
    } else {
      matrix.rows.forEach((row) => {
        row.isFolded = true;

        row.buttons.forEach((button) => {
          if (button.isActive) {
            row.isFolded = false;
          }
        });
      });
      isInFoldMode = true;
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

    return new Row(rowArray, 'Kick', 'kick');
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

    return new Row(rowArray, 'Snare', 'snare');
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

    return new Row(rowArray, 'HiHat', 'hihat');
  }

  private createMatrixDrums() {
    const matrix: Matrix = new Matrix();
    matrix.rows.push(this.createKickRow());
    matrix.rows.push(this.createHihatRow());
    matrix.rows.push(this.createSnareRow());
    matrix.name = 'Drums';
    matrixCollection.push(matrix);
    this.logger.info("Created matrix for instrument: 'Drums'", matrix);
  }
  //endregion

  //region Piano Matrix
  private createMatrixPiano() {
    const matrix: Matrix = new Matrix();
    for (let i = 0; i < NUMBER_OF_ROWS_PIANO_INSTRUMENT; i++) {
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
    matrixCollection.push(matrix);
    this.logger.info("Created matrix for instrument: 'Piano'", matrix);
  }
  //endregion
  //endregion

  /**
   * Stops to play the notes on the matrix
   */
  public stop() {
    isPlaying = false;

    if (playSubscription) {
      playSubscription.unsubscribe();

      for (const rows of matrix.rows) {
        const oldButton: RowButton = rows.buttons[currentPlayedColumnIndex];
        oldButton.isPlayed = false;
      }

      currentPlayedColumnIndex = 0;
    }
  }

  /**
   * Starts to play the notes on the matrix from the beginning.
   * If the matrix is already played at this moment, it is stopped and starts again bon,
   */
  public start() {
    this.stop();

    isPlaying = true;

    for (const rows of matrix.rows) {
      const oldButton: RowButton = rows.buttons[0];
      oldButton.isPlayed = true;

      if (oldButton.isActive) {
        this.communicationService.sendMessage(oldButton.oscMessage);
      }
    }

    playSubscription = _interval.subscribe(_ => {
      const nextPlayedColumnIndex = (currentPlayedColumnIndex + 1) % NUMBER_OF_COLUMNS;

      this.showLights();
      this.play(nextPlayedColumnIndex);

      currentPlayedColumnIndex = nextPlayedColumnIndex;
    });

    subject.next(msPerBeat);
  }

  private play(columnIndex: number) {
    for (const matrix of matrixCollection) {
      for (const rows of matrix.rows) {
        const newButton: RowButton = rows.buttons[columnIndex];
        newButton.isPlayed = true;

        if (newButton.isActive) {
          this.communicationService.sendMessage(newButton.oscMessage);
        }
      }
    }
  }

  private showLights() {
    for (const rows of matrix.rows) {
      const oldButton: RowButton = rows.buttons[currentPlayedColumnIndex];
      oldButton.isPlayed = false;
    }
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

  //region Context Menu Methods
  //region Context Menu For Row Buttons
  /**
   * A long press activates the context menu with further setting options for an entry in the matrix.
   */
  onLongPressRowButton(event: MouseEvent, button: RowButton) {
    event.preventDefault();

    if (button.isActive) {
      this.contextMenuPosition.x = event.pageX + 'px';
      this.contextMenuPosition.y = event.pageY + 'px';
      this.contextMenu.menuData = {button};
      this.contextMenu.openMenu();
    }

    this.logger.info('Performed long press on row button', button);
  }

  /**
   * Opens the context menu of a specific entry of the matrix specified by the row button.
   */
  onContextMenuRowButton(event: MouseEvent, button: RowButton) {
    event.preventDefault();

    if (button.isActive) {
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { button };
      this.contextMenu.openMenu();
    }

    this.logger.info('Performed right click on row button', button);
  }
  //endregion

  //region Context Menu Note Button
  public onContextMenuNoteButton(event, row: Row) {
    event.preventDefault();

    const instrument = row.instrument;

    this.effectContextMenuPosition.x = event.clientX + 'px';
    this.effectContextMenuPosition.y = event.clientY + 'px';
    this.effectContextMenu.menuData = { instrument };
    this.effectContextMenu.openMenu();

    this.logger.info('Performed right click on instrument button', row);
  }

  public onLongPressNoteButton(event, row: Row) {
    event.preventDefault();

    const instrument = row.instrument;

    this.effectContextMenuPosition.x = event.pageX + 'px';
    this.effectContextMenuPosition.y = event.pageY + 'px';
    this.effectContextMenu.menuData = { instrument };
    this.effectContextMenu.openMenu();

    this.logger.info('Performed long press on instrument button', row);
  }
  //endregion
  //endregion

  /**
   * Hides the main navigation so that there is more space for the matrix
   */
  public switchNavigation() {
    this.navigationService.switchNavigation();
  }

  //region Sound Effects
  public isReverbUsed(instrument: InstrumentName) {
    return useReverbMap.get(instrument);
  }

  public isPingPongDelayUsed(instrument: InstrumentName) {
    return usePingPongDelayMap.get(instrument);
  }

  public addReverb(event, instrument: InstrumentName) {
    event.stopPropagation();
    // event.preventDefault();
    const oscMessage: IOSCMessage = {
      address: '/effect/instrument/reverb',
      args: [
        { type: 's', value: instrument },
        { type: 'i', value: this.isReverbUsed(instrument) ? 0 : 1 }
      ],
      info: {
        address: '/play_note',
        family: 'IPv4',
        port: 80,
        size: 1,
      }
    };

    this.communicationService.sendMessage(oscMessage);

    useReverbMap.set(instrument, !this.isReverbUsed(instrument));
    this.logger.debug(`Switched reverb effect on instrument '${instrument}'`);
  }

  public addPingPongDelay(event, instrument: InstrumentName) {
    event.stopPropagation();
    // event.preventDefault();
    const oscMessage: IOSCMessage = {
      address: '/effect/instrument/pingpongdelay',
      args: [
        { type: 's', value: instrument },
        { type: 'i', value: this.isPingPongDelayUsed(instrument) ? 0 : 1 }
      ],
      info: {
        address: '/play_note',
        family: 'IPv4',
        port: 80,
        size: 1,
      }
    };

    this.communicationService.sendMessage(oscMessage);

    usePingPongDelayMap.set(instrument, !this.isPingPongDelayUsed(instrument));
    this.logger.debug(`Switched pingpongdelay effect on instrument '${instrument}'`);
  }

  public switchReverbOnMaster() {
    useReverbOnMaster = !useReverbOnMaster;

    const oscMessage: IOSCMessage = {
      address: '/effect/master/reverb',
      args: [
        { type: 'i', value: useReverbOnMaster ? 1 : 0 }
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
    usePingPongDelayOnMaster = !usePingPongDelayOnMaster;

    const oscMessage: IOSCMessage = {
      address: '/effect/master/pingpongdelay',
      args: [
        { type: 'i', value: usePingPongDelayOnMaster ? 1 : 0 }
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

  public switchEQOnMaster() {
    useEQOnMaster = !useEQOnMaster;

    if (!useEQOnMaster) {
      useEQLowOnMaster = false;
      useEQMidOnMaster = false;
      useEQHighOnMaster = false;
    } else if (!useEQLowOnMaster && !useEQMidOnMaster && !useEQHighOnMaster) {
      useEQLowOnMaster = true;
      useEQMidOnMaster = true;
      useEQHighOnMaster = true;
    }

    const oscMessage: IOSCMessage = {
      address: '/effect/master/eq',
      args: [
        { type: 'i', value: useEQOnMaster ? 1 : 0 }
      ],
      info: {
        address: '/play_note',
        family: 'IPv4',
        port: 80,
        size: 1,
      }
    };

    this.communicationService.sendMessage(oscMessage);

    this.logger.debug('Switched EQ on master');
  }

  public switchEQLowOnMaster() {
    useEQLowOnMaster = !useEQLowOnMaster;

    if (!useEQOnMaster) {
      this.switchEQOnMaster();
    }

    this.sendEQLow();
    this.sendEQMid();
    this.sendEQHigh();

    this.checkIfEQIsStillActive();

    this.logger.debug('Switched low gain of master');
  }

  public checkIfEQIsStillActive() {
    if (!useEQLowOnMaster && !useEQMidOnMaster && !useEQHighOnMaster) {
      this.switchEQOnMaster();
    }
  }

  public sendEQLow() {
    const oscMessage: IOSCMessage = {
      address: '/effect/master/eq/low',
      args: [
        { type: 'i', value: useEQLowOnMaster ? 0 : -10 }
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

  public sendEQMid() {
    const oscMessage: IOSCMessage = {
      address: '/effect/master/eq/mid',
      args: [
        { type: 'i', value: useEQMidOnMaster ? 0 : -10 }
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

  public sendEQHigh() {
    const oscMessage: IOSCMessage = {
      address: '/effect/master/eq/high',
      args: [
        { type: 'i', value: useEQHighOnMaster ? 0 : -10 }
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

  public switchEQMidOnMaster() {
    useEQMidOnMaster = !useEQMidOnMaster;

    if (!useEQOnMaster) {
      this.switchEQOnMaster();
    }

    this.sendEQLow();
    this.sendEQMid();
    this.sendEQHigh();

    this.checkIfEQIsStillActive();

    this.logger.debug('Switched mid gain of master');
  }

  public switchEQHighOnMaster() {
    useEQHighOnMaster = !useEQHighOnMaster;

    if (!useEQOnMaster) {
      this.switchEQOnMaster();
    }

    this.sendEQLow();
    this.sendEQMid();
    this.sendEQHigh();

    this.checkIfEQIsStillActive();

    this.logger.debug('Switched high gain of master');
  }
  //endregion

  //region Presets
  private getChord(rootNote: string, octave: number, quality: ChordQuality) {
    const rootIndex = NOTES_MAJOR_C.findIndex((note: string) => note === rootNote);
    const third = NOTES_MAJOR_C[(rootIndex + 2) % 7];
    const fifth = NOTES_MAJOR_C[(rootIndex + 4) % 7];
    return [
      `${rootNote}${octave}`,
      `${third}${octave}`,
      `${fifth}${octave}`,
    ];
  }

  private setNote(note: string, columnIndex: number) {
    const rowIndex = matrixCollection[1].rows.findIndex((row: Row) => row.name === note);
    if (rowIndex >= 0) {
      matrixCollection[1].rows[rowIndex].buttons[columnIndex].isActive = true;
    } else {
      this.logger.error('Note not found in matrix');
    }
  }

  public setChordProgression() {
    const tonic = this.getChord('C', 2, ChordQuality.MAJOR);
    const subdominant = this.getChord('F', 2, ChordQuality.MAJOR);
    const dominant = this.getChord('G', 2, ChordQuality.MAJOR);

    const tonicColumn = 0;
    const subdominantColumn = 4;
    const dominantColumn = 6;

    tonic.forEach((note) => {
      this.setNote(note, tonicColumn);
    });

    subdominant.forEach((note) => {
      this.setNote(note, subdominantColumn);
    });

    dominant.forEach((note) => {
      this.setNote(note, dominantColumn);
    });
  }

  public setDrumBeat() {
    // kick
    matrixCollection[0].rows[0].buttons[0].isActive = true;
    matrixCollection[0].rows[0].buttons[4].isActive = true;

    // snare
    matrixCollection[0].rows[2].buttons[2].isActive = true;
    matrixCollection[0].rows[2].buttons[6].isActive = true;

    // hihat
    for (let columnIndex = 0; columnIndex < NUMBER_OF_COLUMNS; columnIndex++) {
      matrixCollection[0].rows[1].buttons[columnIndex].isActive = true;
    }
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
