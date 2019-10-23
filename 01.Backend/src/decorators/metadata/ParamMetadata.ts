import { ActionMetadata } from "./ActionMetadata";
import { IParamMetadataArgs } from './args/ParamMetadataArgs';
import { ParamTypes } from "./types/ParamTypes";

export class ParamMetadata {

  /**
   * Parameter's action.
   */
  public actionMetadata: ActionMetadata;

  /**
   * Parameter target.
   */
  public target: Function;

  /**
   * Method on which's parameter is attached.
   */
  public method: string;

  /**
   * Index (# number) of the parameter in the method signature.
   */
  public index: number;

  /**
   * Parameter type.
   */
  public type: ParamTypes;

  /**
   * Extra parameter value.
   */
  public value: any;

  /**
   * Reflected type of the parameter.
   */
  public reflectedType: any;


  constructor(actionMetadata: ActionMetadata, args: IParamMetadataArgs) {
    this.actionMetadata = actionMetadata;
    this.target = args.target;
    this.method = args.method;
    this.reflectedType = args.reflectedType;
    this.index = args.index;
    this.type = args.type;
    this.value = args.value;
  }

}
