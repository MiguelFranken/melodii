import { RowButton } from './row-button';
import { InstrumentName } from '../../generator/library/types';

export class Row {
  public isExpanded = true;
  public isFolded = false;
  public name = 'row name';

  constructor(public buttons: RowButton[], name?: string, public instrument: InstrumentName = "piano") {
    this.name = name;
  }
}
