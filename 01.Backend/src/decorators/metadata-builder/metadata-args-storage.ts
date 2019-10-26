import { IControllerMetadataArgs } from '../metadata/args/controller-metadata-args';
import { IActionMetadataArgs } from '../metadata/args/action-metadata-args';
import { IParamMetadataArgs } from '../metadata/args/param-metadata-args';

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
