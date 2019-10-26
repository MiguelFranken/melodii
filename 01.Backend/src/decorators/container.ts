/**
 * Container to be used for inversion of control (IoC).
 * See https://www.tutorialsteacher.com/ioc for some helpful information about IoC
 */
import { Foo } from "../controllers/foo";
import { SocketServer } from "../socket/socket-server";

export class Container {

  // registry of all controller instances
  private controllerInstances: Array<{ type: Function, object: any }> = [];

  // registry of all controller´s dependencies
  private controllerDependencies: Array<{ type: Function, object: any }> = [];

  constructor(private socketServer: SocketServer) {
    // add socket server instance to registry
    const instance = { type: SocketServer, object: socketServer };
    this.controllerDependencies.push(instance);
  }

  private resolve<T>(someControllerClass: new (...args: any[]) => T): T {
    // find or create new instances for dependencies of the controller
    const ctorParams: any[] = Reflect.getMetadata("design:paramtypes", someControllerClass) || [];
    let params = ctorParams.map((param) => {
      let dependencyInstance = this.controllerDependencies.find((instance: any) => instance.type === param);
      if (!dependencyInstance) {
        dependencyInstance = { type: param, object: new param() };
        this.controllerDependencies.push(dependencyInstance);
      }

      return dependencyInstance.object;
    });

    // find controller class in registry
    let instance = this.controllerInstances.find((instance: any) => instance.type === someControllerClass);

    // create new instance if nothing was found
    if (!instance) {
      instance = { type: someControllerClass, object: new someControllerClass(...params) };
      this.controllerInstances.push(instance);
    }

    // returns the actual instance
    return instance.object;
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
