import { ControllerMetadata } from './ControllerMetadata';
import { IActionMetadataArgs } from '../args/ActionMetadataArgs';

export class ActionMetadata {

  public controllerMetadata: ControllerMetadata;

  /**
   * Message name served by this action.
   */
  public name: string;

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

  public executeAction(/*params: any[]*/) {
    // TODO: params noch hinzunehmen
    return this.controllerMetadata.instance[this.method].apply(this.controllerMetadata.instance);
  }

}
