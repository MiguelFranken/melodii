import { MetadataArgsStorage } from './metadata-builder/MetadataArgsStorage';
import { importClassesFromDirectories } from './util/DirectoryExportedClassesLoader';
import * as OSC from 'osc';
import { ControllerExecutor } from './ControllerExecutor';
import { SocketServer } from "../socket/socket-server";

export function addControllers(io: OSC.UDPPort, controllers: Function[] | string[], webserver: SocketServer) {
  createExecutor(io, controllers, webserver);
}


/**
 * Gets the metadata arguments storage.
 */
export function defaultMetadataArgsStorage(): MetadataArgsStorage {
  if (!(global as any).socketControllersMetadataArgsStorage) {
    (global as any).socketControllersMetadataArgsStorage = new MetadataArgsStorage();
  }

  return (global as any).socketControllersMetadataArgsStorage;
}

/**
 * @param io
 * @param controllers List of directories from where to "require" all your controllers
 * @param webserver
 */
export function createExecutor(io: OSC.UDPPort, controllers: Function[] | string[], webserver: SocketServer) {
  console.log('Create executor..');
  const executor = new ControllerExecutor(io, webserver);

  let controllerClasses: Function[];
  controllerClasses = (controllers as any[]).filter((controller) => controller instanceof Function); // todo: das mit string sollte für dieses Projekt nicht notwendig sein
  const controllerDirs = (controllers as any[]).filter((controller) => typeof controller === "string");
  controllerClasses.push(...importClassesFromDirectories(controllerDirs));

  // run socket controller register and other operations
  executor.execute(controllerClasses);
}

export * from "./container";
export * from "./decorators";
