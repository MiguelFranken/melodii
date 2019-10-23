import { IControllerMetadataArgs } from '../metadata/args/IControllerMetadataArgs';
import { IActionMetadataArgs } from '../metadata/args/ActionMetadataArgs';

/**
 * Storage all metadatas read from decorators.
 */
export class MetadataArgsStorage {

    public controllers: IControllerMetadataArgs[] = [];
    public actions: IActionMetadataArgs[] = [];

    public findControllerMetadatasForClasses(classes: Function[]): IControllerMetadataArgs[] {
        return this.controllers.filter((ctrl) => {
            return classes.filter((cls) => ctrl.target === cls).length > 0;
        });
    }

    public findActionsWithTarget(target: Function): IActionMetadataArgs[] {
        return this.actions.filter((action) => action.target === target);
    }

}
