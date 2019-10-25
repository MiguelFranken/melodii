/**
 * Container to be used by this for inversion of control (IoC).
 * See https://www.tutorialsteacher.com/ioc for some helpful information about IoC
 */
const container: { get<T>(someClass: (new (...args: any[]) => T) | Function): T }
  = new (class {
  private instances: Array<{ type: Function, object: any }> = [];

  public get<T>(someClass: new (...args: any[]) => T): T {
    let instance = this.instances.find((instance: any) => instance.type === someClass);

    // create new instance
    if (!instance) {
      instance = { type: someClass, object: new someClass() };
      this.instances.push(instance);
    }

    return instance.object;
  }
})();

/**
 * Gets the IOC container
 *
 * Returns the instance of class T from the container.
 * If there was no instance of T in the container, an instance of T is created,
 * stored in the container to the remaining instances of other classes, and then returned.
 */
export function getFromContainer<T>(someClass: (new(...args: any[]) => T) | Function): T {
  return container.get<T>(someClass);
}
