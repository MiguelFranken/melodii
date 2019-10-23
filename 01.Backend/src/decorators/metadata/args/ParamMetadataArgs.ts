import { ParamTypes } from "../types/ParamTypes";

/**
 * Controller metadata used to storage information about registered parameters.
 */
export interface IParamMetadataArgs {

    /**
     * Parameter target.
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
