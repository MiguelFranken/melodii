import { ControllerMetadata } from './ControllerMetadata';
import { ParamMetadata } from './ParamMetadata';
import { IActionMetadataArgs } from './args/ActionMetadataArgs';
import { OSCMessage } from '../../osc/osc-message';

export class ActionMetadata {

  public controllerMetadata: ControllerMetadata;

  /**
   * Message name served by this action.
   */
  public name: string;

  /**
   * Action's parameters.
   */
  public params: ParamMetadata[] = [];

  /**
   * Class on which's method this action is attached.
   */
  public target: Function;

  /**
   * Object's method that will be executed on this action.
   */
  public method: string;


  constructor(controllerMetadata: ControllerMetadata, args: IActionMetadataArgs) {
    this.controllerMetadata = controllerMetadata;
    this.name = args.name ? args.name : '';
    this.target = args.target;
    this.method = args.method;
  }

  public executeAction(oscMessage: OSCMessage) {
    // todo: wenn es mehrere params geben soll, dann müssen diese geordnet werden vorher
    return this.controllerMetadata
      .instance[this.method].apply(this.controllerMetadata.instance, [oscMessage]);
  }

}
