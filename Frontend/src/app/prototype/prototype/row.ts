import { RowButton } from './row-button';

export class Row {
  public isExpanded = true;
  public isFolded = false;
  public name = 'row name';

  constructor(public buttons: RowButton[], name?: string) {
    this.name = name;
  }
}
