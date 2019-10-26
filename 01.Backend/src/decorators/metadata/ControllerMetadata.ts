import { ActionMetadata } from './ActionMetadata';
import { IControllerMetadataArgs } from './args/IControllerMetadataArgs';
import { container } from "../../index";

export class ControllerMetadata {

  /**
   * Indicates object which is used by this controller.
   */
  public target: any;

  /**
   * Base route for all actions registered in this controller.
   */
  public namespace: string | RegExp;

  /**
   * Controller actions.
   */
  public actions: ActionMetadata[] = [];

  constructor(args: IControllerMetadataArgs) {
    this.target = args.target;
    this.namespace = args.namespace ? args.namespace : '';
  }

  //region Accessors
  get instance(): any {
    return container.get(this.target);
  }
  //endregion

}
