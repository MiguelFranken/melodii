import { ControllerExecutor } from './controller-executor';
import { Container } from './container';
import { GeneratorCommunicationService } from '../generator-communication.service';

export class ControllerHandler {

  private container: Container;

  constructor(private directCommunicationService: GeneratorCommunicationService) {
    this.container = new Container();
  }

  public addControllers(controllers: Function[] | string[]) {
    this.createExecutor(controllers);
  }

  public createExecutor(controllers: Function[] | string[]) {
    const executor = new ControllerExecutor(this.directCommunicationService);

    // get controller classes
    let controllerClasses: Function[];
    controllerClasses = (controllers as any[]).filter((controller) => controller instanceof Function);

    executor.execute(controllerClasses);
  }

}
