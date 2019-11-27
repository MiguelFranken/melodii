import { ParamTypes } from "../types/param-types";

/**
 * Controller metadata used to storage information about registered parameters.
 */
export interface IParamMetadataArgs {

    /**
     * Parameter target, i.e. a controller class
     */
    target: any;

    /**
     * Method on which's parameter is attached.
     */
    method: string;

    /**
     * Index of the parameter in the method signature.
     */
    index: number;

    /**
     * Parameter type.
     * This is derived from the decorator
     */
    type: ParamTypes;

    /**
     * Reflected type of the parameter.
     */
    reflectedType: any;

    /**
     * Extra parameter value.
     */
    value?: any;

}
