import { IControllerMetadataArgs } from './metadata/args/IControllerMetadataArgs';
import { defaultMetadataArgsStorage } from './index';
import { IActionMetadataArgs } from './metadata/args/ActionMetadataArgs';
import { IParamMetadataArgs } from './metadata/args/ParamMetadataArgs';
import { ParamTypes } from './metadata/types/ParamTypes';

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
    console.log('Visited @Controller decorator');
    defaultMetadataArgsStorage().controllers.push(metadata);
  };
}

/**
 * Registers controller's action to be executed when socket receives message with given name.
 */
export function OnMessage(name?: string): Function {
  return (object: Object, methodName: string) => {
    console.log('Visited @OnMessage decorator');
    const metadata: IActionMetadataArgs = {
      name: name,
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

/**
 * Injects the websocket
 */
export function Web() {
  return (object: Object, methodName: string, index: number) => {
    const format = (Reflect as any).getMetadata("design:paramtypes", object, methodName)[index];
    const metadata: IParamMetadataArgs = {
      target: object.constructor,
      method: methodName,
      index: index,
      type: ParamTypes.WEB_SOCKET,
      reflectedType: format,
    };
    defaultMetadataArgsStorage().params.push(metadata);
  };
}
