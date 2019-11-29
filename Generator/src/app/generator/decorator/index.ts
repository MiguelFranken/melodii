import { ControllerExecutor } from './controller-executor';
import { Container } from './container';

export class ControllerHandler {

  private container: Container;

  constructor() {
    this.container = new Container();
  }

  public addControllers(socket: SocketIOClient.Socket, controllers: Function[] | string[]) {
    this.createExecutor(socket, controllers);
  }

  public createExecutor(socket: SocketIOClient.Socket, controllers: Function[] | string[]) {
    const executor = new ControllerExecutor(socket);

    // get controller classes
    let controllerClasses: Function[];
    controllerClasses = (controllers as any[]).filter((controller) => controller instanceof Function);

    executor.execute(controllerClasses);
  }

}
