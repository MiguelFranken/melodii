import { IOSCMessage } from '../../shared/osc/osc-message';
import { Velocity } from '../../generator/library/types';

export class RowButton {
  public isPlayed = false;
  public isActive = false;
  public id: string;
  public _velocity: Velocity = 80;

  public set velocity(value: Velocity) {
    this._velocity = value;
    this.oscMessage.args[1].value = value;
  }

  public get velocity(): Velocity {
    return this._velocity;
  }

  public oscMessage: IOSCMessage;

  constructor(note?: string) {
    this.id = note;
    if (note) {
      this.setOSCNoteMessage(note);
    }
  }

  private setOSCNoteMessage(note) {
    this.oscMessage = {
      address: '/play_note',
      args: [
        { type: 's', value: note }
      ],
      info: {
        address: '/play_note',
        family: 'IPv4',
        port: 80,
        size: 1,
      }
    };
  }

  public setOSCMessage(msg: IOSCMessage) {
    this.oscMessage = msg;
  }

}
