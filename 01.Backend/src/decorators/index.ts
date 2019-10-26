import { MetadataArgsStorage } from './metadata-builder/metadata-args-storage';
import { importClassesFromDirectories } from './util/directory-exported-classes-loader';
import * as OSC from 'osc';
import { ControllerExecutor } from './controller-executor';
import { SocketServer } from "../socket/socket-server";

export function addControllers(io: OSC.UDPPort, controllers: Function[] | string[], webserver: SocketServer) {
  createExecutor(io, controllers, webserver);
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
 * @param webserver
 */
export function createExecutor(io: OSC.UDPPort, controllers: Function[] | string[], webserver: SocketServer) {
  const executor = new ControllerExecutor(io, webserver);

  // get controller classes
  let controllerClasses: Function[];
  controllerClasses = (controllers as any[]).filter((controller) => controller instanceof Function);
  const controllerDirs = (controllers as any[]).filter((controller) => typeof controller === "string");
  controllerClasses.push(...importClassesFromDirectories(controllerDirs));

  executor.execute(controllerClasses);
}

export * from "./container";
export * from "./decorators";
