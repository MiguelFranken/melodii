import { IControllerMetadataArgs } from '../metadata/args/controller-metadata-args';
import { ParamMetadata } from '../metadata/param-metadata';
import { ControllerMetadata } from '../metadata/controller-metadata';
import { ActionMetadata } from '../metadata/action-metadata';
import { defaultMetadataArgsStorage } from '../storage';

export class MetadataBuilder {

  //region Public methods
  public buildControllerMetadata(classes?: Function[]) {
    return this.createControllers(classes);
  }
  //endregion

  //region Private methods
  private createControllers(classes?: Function[]): ControllerMetadata[] {
    const storage = defaultMetadataArgsStorage();

    const controllers = !classes ? storage.controllers : storage.findControllerMetadataForControllers(classes);

    return controllers.map((controllerArgs: IControllerMetadataArgs) => {
      const controller = new ControllerMetadata(controllerArgs);
      controller.actions = this.createActions(controller);
      return controller;
    });
  }

  private createActions(controller: ControllerMetadata): ActionMetadata[] {
    return defaultMetadataArgsStorage()
      .findActionsForController(controller.target)
      .map((actionArgs: any) => {
        const action = new ActionMetadata(controller, actionArgs);
        action.params = this.createParams(action);
        // action.results = this.createResults(action);
        return action;
      });
  }

  private createParams(action: ActionMetadata): ParamMetadata[] {
    return defaultMetadataArgsStorage()
      .findParamsForControllerAndMethod(action.target, action.method)
      .map((paramArgs) => new ParamMetadata(action, paramArgs));
  }
  //endregion

}
