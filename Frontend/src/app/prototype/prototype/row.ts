import { RowButton } from "./row-button";

export class Row {
  public isExpanded = true;
  public isFolded: boolean = false;
  public name: string = "row name";

  constructor(public buttons: RowButton[]) {
  }
}
