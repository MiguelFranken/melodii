import { ActionMetadata } from './ActionMetadata';
import { IControllerMetadataArgs } from './args/IControllerMetadataArgs';
import { getFromContainer } from '../container';

export class ControllerMetadata {

  public target: Function;
  public namespace: string | RegExp;
  public actions: ActionMetadata[] = [];

  constructor(args: IControllerMetadataArgs) {
    this.target = args.target;
    this.namespace = args.namespace ? args.namespace : '';
  }

  //region Accessors
  get instance(): any {
    return getFromContainer(this.target);
  }
  //endregion

}
