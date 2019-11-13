import { MetadataArgsStorage } from './metadata-builder/metadata-args-storage';
// import { importClassesFromDirectories } from './util/directory-exported-classes-loader';
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
 * @param io
 * @param controllers List of directories from where to "require" all the controllers
 * @param webserver Socket server for bi-directional communication with the Angular frontend
 */
export function createExecutor(socket: SocketIOClient.Socket, controllers: Function[] | string[]) {
  const executor = new ControllerExecutor(socket);

  // get controller classes
  let controllerClasses: Function[];
  controllerClasses = (controllers as any[]).filter((controller) => controller instanceof Function);
  // const controllerDirs = (controllers as any[]).filter((controller) => typeof controller === "string");
  // controllerClasses.push(...importClassesFromDirectories(controllerDirs));

  executor.execute(controllerClasses);
}

export * from "./container";
export * from "./decorators";
