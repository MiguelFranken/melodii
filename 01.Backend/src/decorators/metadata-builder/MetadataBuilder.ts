import { defaultMetadataArgsStorage } from '../index';
import { IControllerMetadataArgs } from '../metadata/args/IControllerMetadataArgs';
import { ParamMetadata } from '../metadata/ParamMetadata';
import { ControllerMetadata } from '../metadata/ControllerMetadata';
import { ActionMetadata } from '../metadata/ActionMetadata';

export class MetadataBuilder {

  //region Public methods
  public buildControllerMetadata(classes?: Function[]) {
    return this.createControllers(classes);
  }
  //endregion

  //region Private methods
  private createControllers(classes?: Function[]): ControllerMetadata[] {
    const storage = defaultMetadataArgsStorage();

    const controllers = !classes ? storage.controllers :
      storage.findControllerMetadatasForClasses(classes);

    return controllers.map((controllerArgs: IControllerMetadataArgs) => {
      const controller = new ControllerMetadata(controllerArgs);
      controller.actions = this.createActions(controller);
      return controller;
    });
  }

  private createActions(controller: ControllerMetadata): ActionMetadata[] {
    return defaultMetadataArgsStorage()
      .findActionsWithTarget(controller.target)
      .map((actionArgs: any) => {
        const action = new ActionMetadata(controller, actionArgs);
        action.params = this.createParams(action);
        // action.results = this.createResults(action);
        return action;
      });
  }

  private createParams(action: ActionMetadata): ParamMetadata[] {
    return defaultMetadataArgsStorage()
      .findParamsWithTargetAndMethod(action.target, action.method)
      .map((paramArgs) => new ParamMetadata(action, paramArgs));
  }
  //endregion

}
