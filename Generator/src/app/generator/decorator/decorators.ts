import { IControllerMetadataArgs } from './metadata/args/controller-metadata-args';
import { defaultMetadataArgsStorage } from './index';
import { IActionMetadataArgs } from './metadata/args/action-metadata-args';
import { IParamMetadataArgs } from './metadata/args/param-metadata-args';
import { ParamTypes } from './metadata/types/param-types';

/**
 * Registers a class to be a osc controller that can listen to osc messages and respond to them.
 * @param namespace Namespace in which this controller's events will be registered.
 */
export function Controller(namespace?: string | RegExp) {
  return (object: Function) => {
    const metadata: IControllerMetadataArgs = {
      namespace: namespace,
      target: object,
    };
    defaultMetadataArgsStorage().controllers.push(metadata);
  };
}

/**
 * Registers controller's action to be executed when socket receives message with given name.
 */
export function OnMessage(...names: string[]): Function {
  let namesArg: Set<string> | undefined;
  if (names.length !== 0) {
    namesArg = new Set<string>(names);
  }
  return (object: Object, methodName: string) => {
    const metadata: IActionMetadataArgs = {
      name: namesArg,
      target: object.constructor,
      method: methodName,
    };
    defaultMetadataArgsStorage().actions.push(metadata);
  };
}

/**
 * Injects received osc message
 */
export function Message() {
  return (object: Object, methodName: string, index: number) => {
    const format = (Reflect as any).getMetadata("design:paramtypes", object, methodName)[index];
    const metadata: IParamMetadataArgs = {
      target: object.constructor,
      method: methodName,
      index: index,
      type: ParamTypes.OSC_MESSAGE,
      reflectedType: format,
    };
    defaultMetadataArgsStorage().params.push(metadata);
  };
}
