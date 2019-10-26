import { ControllerMetadata } from './controller-metadata';
import { ParamMetadata } from './param-metadata';
import { IActionMetadataArgs } from './args/action-metadata-args';
import { OSCMessage } from '../../osc/osc-message';

export class ActionMetadata {

  public controllerMetadata: ControllerMetadata;

  /**
   * Message address served by this action.
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

  public executeAction(params: any[]) {
    return this.controllerMetadata
      .instance[this.method].apply(this.controllerMetadata.instance, params);
  }

}
