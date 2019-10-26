import { SocketServer } from "../socket/socket-server";

class Registry {

  protected _registryMap = new Map<Function, any>();

  public get(key: Function): any | null {
    return this._registryMap.get(key);
  }

  public set(key: Function, value: any): any {
    this._registryMap.set(key, value);
    return value;
  }

  public has(key: Function): boolean {
    return this._registryMap.has(key);
  }

}

/**
 * Container for inversion of control (IoC).
 * See https://www.tutorialsteacher.com/ioc for some helpful information about IoC
 */
export class Container {

  // registry of all controller instances
  private controllerRegistry: Registry = new Registry();

  // registry of all controller´s dependencies
  private dependenciesRegistry: Registry = new Registry();

  constructor(private socketServer: SocketServer) {
    // add socket server instance to registry
    this.dependenciesRegistry.set(SocketServer, socketServer);
  }

  private resolve<T>(someControllerClass: new (...args: any[]) => T): T {
    // find or create new instances for dependencies of the controller
    const ctorParams: any[] = Reflect.getMetadata("design:paramtypes", someControllerClass) || [];
    let params = ctorParams.map((param) => {
      if (this.dependenciesRegistry.has(param)) {
        return this.dependenciesRegistry.get(param);
      } else {
        return this.dependenciesRegistry.set(param, new param());
      }
    });

    // find controller class in controller registry
    if (this.controllerRegistry.has(someControllerClass)) {
      return this.controllerRegistry.get(someControllerClass);
    } else {
      // create new instance if nothing was found and then return this instance
      return this.controllerRegistry.set(someControllerClass, new someControllerClass(...params));
    }
  }

  /**
   * Gets the IOC container
   *
   * Returns the instance of class T from the container.
   * If there was no instance of T in the container, an instance of T is created,
   * stored in the container to the remaining instances of other classes, and then returned.
   */
  public get<T>(someClass: (new(...args: any[]) => T)): T {
    return this.resolve<T>(someClass);
  }

}
