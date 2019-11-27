import { MetadataArgsStorage } from './metadata-builder/metadata-args-storage';
import { ControllerExecutor } from './controller-executor';

export function addControllers(socket: SocketIOClient.Socket, controllers: Function[] | string[]) {
  createExecutor(socket, controllers);
}

/**
 * Gets the metadata arguments storage.
 */
export function defaultMetadataArgsStorage(): MetadataArgsStorage {
  // create metadata args storage if not already created
  if (!(global as any).metadataArgsStorage) {
    (global as any).metadataArgsStorage = new MetadataArgsStorage();
  }

  return (global as any).metadataArgsStorage;
}

/**
 * @param controllers List of directories from where to "require" all the controllers
 */
export function createExecutor(socket: SocketIOClient.Socket, controllers: Function[] | string[]) {
  const executor = new ControllerExecutor(socket);

  // get controller classes
  let controllerClasses: Function[];
  controllerClasses = (controllers as any[]).filter((controller) => controller instanceof Function);

  executor.execute(controllerClasses);
}

export * from './container';
export * from './decorators';
