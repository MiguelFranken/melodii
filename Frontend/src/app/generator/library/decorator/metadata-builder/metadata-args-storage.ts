import { IControllerMetadataArgs } from '../metadata/args/controller-metadata-args';
import { IActionMetadataArgs } from '../metadata/args/action-metadata-args';
import { IParamMetadataArgs } from '../metadata/args/param-metadata-args';

/**
 * Stores all metadata read from the decorators
 */
export class MetadataArgsStorage {

    public controllers: IControllerMetadataArgs[] = [];
    public actions: IActionMetadataArgs[] = [];
    public params: IParamMetadataArgs[] = [];

    /**
     * Returns all stored controller metadata for the specified controller classes
     * @param controllerClasses Array of controller classes
     */
    public findControllerMetadataForControllers(controllerClasses: Function[]): IControllerMetadataArgs[] {
        return this.controllers.filter((ctrl) => {
            return controllerClasses.filter((cls) => ctrl.target === cls).length > 0;
        });
    }

    /**
     * Returns the action metadata for some specified controller class
     * @param controllerClass The controller class to find actions for
     */
    public findActionsForController(controllerClass: Function): IActionMetadataArgs[] {
        return this.actions.filter((action) => action.target === controllerClass);
    }

    /**
     * Returns the param metadata for some specified (action) method within a controller class
     * @param controllerClass Some controller class
     * @param methodName Some method in the specified controller class
     */
    public findParamsForControllerAndMethod(controllerClass: Function, methodName: string): IParamMetadataArgs[] {
        return this.params.filter((param) => {
            return param.target === controllerClass && param.method === methodName;
        });
    }

}
