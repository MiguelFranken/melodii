import { ElementRef, Injectable } from '@angular/core';
import { Logger } from '@upe/logger';
import { OutsidePlacement, RelativePosition, Toppy } from 'toppy';
import { HelpOverlayComponent } from './help-overlay.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, first, map, take } from 'rxjs/operators';

//region Types
export type ChainEntryPreCondition = () => boolean;

export interface ChainEntry {
  overlayID: string;
  preCondition: ChainEntryPreCondition;
  text: string;
  event: string;
}

export type ChainID = string;

export interface Chain {
  chainID: string;
  entries: ChainEntry[];
}

export interface Overlay {
  open();
  close();
}

export interface Element {
  overlayID: string;
  element: ElementRef;
}

export interface OverlayElements {
  chainID: ChainID;
  elements: Element[];
}
//endregion

@Injectable({
  providedIn: 'root'
})
export class HelpOverlayService {

  private logger: Logger = new Logger({ name: 'HelpOverlayService', flags: ['service'] });

  private overlayMap = new Map<string, Map<string, Overlay>>();
  private refs: Map<string, ElementRef> = new Map(); // right now: using overlay id as key but thats not unique

  constructor(private toppy: Toppy) { }

  private chains: Map<ChainID, Chain> = new Map();

  public outputSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public inputSubject: BehaviorSubject<OverlayElements> = new BehaviorSubject<OverlayElements>(null);

  //region Public Methods
  public getSubject(): BehaviorSubject<OverlayElements> {
    return this.inputSubject;
  }

  public getOutputObservable(): Observable<boolean> {
    return this.outputSubject.asObservable();
  }

  public addChain(chain: Chain) {
    this.chains.set(chain.chainID, chain);
    this.logger.debug(`Added new chain '${chain.chainID}'`, chain);
  }

  public triggerChain(chainID: ChainID) {
    const firstEntry: ChainEntry | null = this.getFirstActiveChainEntry(chainID);
    if (firstEntry) {
      this.initOverlay(chainID, firstEntry);
      this.addChainListener(chainID, firstEntry);
      const allOverlaysForChain = this.overlayMap.get(chainID);
      const firstOverlay: Overlay = allOverlaysForChain.get(firstEntry.overlayID);
      firstOverlay.open();
    }
  }
  //endregion

  private getElement(entry: ChainEntry): Observable<ElementRef> {
    this.outputSubject.next(true);
    return this.inputSubject.pipe(
      take(1),
      map((overlayElements: OverlayElements) => {
        return overlayElements.elements.filter((element: Element) => element.overlayID === entry.overlayID)[0].element;
      }));
  }

  //region Private Methods
  private addChainListener(chainID: ChainID, entry: ChainEntry) {
    this.logger.debug('Adding chain listener for entry', entry);

    const chain: Chain = this.chains.get(chainID);

    const listenerFn = () => {
      // remove current listener
      this.logger.debug('Removing event listener..');

      this.getElement(entry).subscribe((element: ElementRef) => {
        element.nativeElement.removeEventListener(entry.event, listenerFn, false);
        this.logger.debug('Removed event lister for entry:', entry);
      });

      // close current overlay
      const allOverlaysForChain = this.overlayMap.get(chainID);
      const currentOverlay: Overlay = allOverlaysForChain.get(entry.overlayID); // TODO MF: Test for null
      currentOverlay.close();

      if ((chain.entries.findIndex((e: ChainEntry) => e.overlayID === entry.overlayID) + 1) < chain.entries.length) {
        const nextChainEntry = this.getNextChainEntry(chain, entry);
        this.addChainListener(chainID, nextChainEntry);
        this.initOverlay(chainID, nextChainEntry);
        const allOverlaysForChain = this.overlayMap.get(chainID);
        allOverlaysForChain.get(nextChainEntry.overlayID).open();
      } else {
        this.logger.debug('Reached last chain entry');
      }
    };

    this.getElement(entry).subscribe((element: ElementRef) => {
      element.nativeElement.addEventListener(entry.event, listenerFn);
      this.logger.debug('Added event listener for entry:', entry);
    });
  }

  private getNextChainEntry(chain: Chain, currentEntry: ChainEntry): ChainEntry | null {
    this.logger.debug('Getting next chain entry for current chain entry:', currentEntry);

    const currentEntryIndex = chain.entries.findIndex((entry: ChainEntry) => entry.overlayID === currentEntry.overlayID);
    for (let i = currentEntryIndex; i < chain.entries.length; i++) {
      for (let j = i + 1; j < chain.entries.length; j++) {
        this.logger.debug(`Chain Loop ${i}/${j}`);

        const nextChainEntry: ChainEntry = chain.entries[j];
        const nextPreCondition: boolean = nextChainEntry.preCondition();

        if (nextPreCondition) {
          this.logger.debug('Computed next chain entry:', chain.entries[j]);
          return chain.entries[j];
        }
      }

    }

    this.logger.debug('Cannot find a next chain entry for current entry:', currentEntry);
    return null;
  }

  private getFirstActiveChainEntry(chainID: ChainID): ChainEntry | null {
    const chain: Chain = this.chains.get(chainID);
    const entries = chain.entries;
    for (const entry of entries) {
      if (entry.preCondition()) {
        this.logger.debug('Found first active chain entry:', entry);
        return entry;
      }
    }
    return null;
  }

  private initOverlay(chainID: ChainID, chainEntry: ChainEntry) {
    this.logger.info(`Initializing overlay '${chainEntry.overlayID}'..`, chainEntry);

    this.getElement(chainEntry).subscribe((element: ElementRef) => {
      const position = new RelativePosition({
        placement: OutsidePlacement.BOTTOM_LEFT,
        src: element.nativeElement
      });

      const overlay = this.toppy
        .position(position)
        .config({})
        .content(HelpOverlayComponent, {text: chainEntry.text, overlayID: chainEntry.overlayID})
        .create();

      if (!this.overlayMap.has(chainID)) {
        this.overlayMap.set(chainID, new Map());
      }
      const allOverlaysForChain = this.overlayMap.get(chainID);
      allOverlaysForChain.set(chainEntry.overlayID, overlay);

      this.logger.info(`Initialized overlay '${chainEntry.overlayID}'`, chainEntry);
    });
  }
  //endregion

}
