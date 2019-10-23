import { IControllerMetadataArgs } from '../metadata/args/IControllerMetadataArgs';
import { IActionMetadataArgs } from '../metadata/args/ActionMetadataArgs';
import { IParamMetadataArgs } from '../metadata/args/ParamMetadataArgs';

/**
 * Storage all metadatas read from decorators.
 */
export class MetadataArgsStorage {

    public controllers: IControllerMetadataArgs[] = [];
    public actions: IActionMetadataArgs[] = [];
    public params: IParamMetadataArgs[] = [];

    public findControllerMetadatasForClasses(classes: Function[]): IControllerMetadataArgs[] {
        return this.controllers.filter((ctrl) => {
            return classes.filter((cls) => ctrl.target === cls).length > 0;
        });
    }

    public findActionsWithTarget(target: Function): IActionMetadataArgs[] {
        return this.actions.filter((action) => action.target === target);
    }

    public findParamsWithTargetAndMethod(
      target: Function, methodName: string): IParamMetadataArgs[] {
        return this.params.filter((param) => {
            return param.target === target && param.method === methodName;
        });
    }

}
