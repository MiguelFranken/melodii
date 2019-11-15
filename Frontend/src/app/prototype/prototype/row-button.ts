import { IOSCMessage } from "../../shared/osc/osc-message";

export class RowButton {
  public isPlayed: boolean = false;
  public isActive: boolean = false;
  public id: string;
  public velocity = 100; // Percent

  public oscMessage: IOSCMessage;

  constructor(note: string) {
    this.id = note;
    this.setOSCMessage(note);
  }

  private setOSCMessage(note) {
    this.oscMessage = {
      address: "/play_note",
      args: [
        { type: "s", value: note }
      ],
      info: {
        address: "/play_note",
        family: "IPv4",
        port: 80,
        size: 1,
      }
    }
  }
}
