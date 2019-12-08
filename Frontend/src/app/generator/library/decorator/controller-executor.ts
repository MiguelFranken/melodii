import { MetadataBuilder } from './metadata-builder/metadata-builder';
import { ActionMetadata } from './metadata/action-metadata';
import { ControllerMetadata } from './metadata/controller-metadata';
import { ParamTypes } from './metadata/types/param-types';
import { Event } from '../socket/socket-event';
import { IOSCMessage } from '../osc/osc-message';
import { Logger } from '@upe/logger';
import { GeneratorCommunicationService } from '../generator-communication.service';
import { filter, map } from 'rxjs/operators';

export class ControllerExecutor {

  private logger: Logger = new Logger({ name: 'Routing', flags: ['routing'] });

  private metadataBuilder: MetadataBuilder;

  constructor(private socket: SocketIOClient.Socket, private directCommunicationService: GeneratorCommunicationService) {
    this.metadataBuilder = new MetadataBuilder();
  }

  public execute(controllerClasses?: Function[]) {
    this.registerControllers(controllerClasses);
  }

  /**
   * Registers controllers.
   */
  private registerControllers(classes?: Function[]): this {
    const controllers = this.metadataBuilder.buildControllerMetadata(classes);
    const controllersWithoutNamespaces = controllers.filter((ctrl) => !ctrl.namespace);
    const controllersWithNamespaces = controllers.filter((ctrl) => !!ctrl.namespace);

    this.logger.info(`Registered ${controllersWithNamespaces.length} controllers with namespaces`);
    this.logger.info(`Registered ${controllersWithoutNamespaces.length} controllers without namespaces`);

    //region register controllers without namespaces
    this.socket.on(Event.OSC_MESSAGE,
      (msg: IOSCMessage) => this.handleConnection(controllersWithoutNamespaces, msg));
    //endregion

    // register controllers with namespaces
    controllersWithNamespaces.forEach((controller: any) => {
      const _namespace: string | RegExp = controller.namespace;
      let namespace: string;
      if (_namespace instanceof RegExp) { // TODO MF: implement the RegExp feature
        // namespace = pathToRegexp(_namespace);
        namespace = '';
      } else {
        namespace = controller.namespace;
      }

      const handlerWithNamespace = (oscMessage: IOSCMessage) => {
        // parse osc address urls (e.g. "/sub1/sub2" -> ["", "sub1", "sub2"])
        const addressUrl = oscMessage.address.split('/');
        const namespaceUrl = namespace.split('/');

        // delete first array element
        addressUrl.shift();
        namespaceUrl.shift();

        // namespace must always be shorter than the received osc address
        if (namespaceUrl.length > addressUrl.length) {
          return;
        } else {
          // check each substring
          for (let i = 0; i < namespaceUrl.length; i++) {
            if (namespaceUrl[i] !== addressUrl[i]) {
              return;
            }
          }
        }

        this.handleConnection([controller], oscMessage);
      };

      this.directCommunicationService.getObservable().pipe(filter(msg => !!msg)).subscribe(handlerWithNamespace);
      this.socket.on(Event.OSC_MESSAGE, handlerWithNamespace);
    });

    return this;
  }

  private handleAction(action: ActionMetadata, oscMessage: IOSCMessage): Promise<any> {
    // compute parameters
    const paramsPromises = action.params
      .sort((param1, param2) => param1.index - param2.index) // nach index sortieren
      .map((param) => {
        // TODO MF: add more param types here in the future if necessary
        switch (param.type) {
          case ParamTypes.OSC_MESSAGE:
            return oscMessage;
        }
      });

    // after all parameters are computed
    const paramsPromise = Promise.all(paramsPromises).catch((error) => {
      this.logger.error('Error during computation params of the controller: ', error);
      throw error;
    });

    return paramsPromise.then((params) => {
      return action.executeAction(params);
    });
  }

  private handleConnection(controllers: ControllerMetadata[], oscMessage: IOSCMessage) {
    controllers.forEach((controller: ControllerMetadata) => {
      controller.actions.forEach((action) => {
        const addressWithoutNamespace = oscMessage.address.replace(controller.namespace, '');
        if (action.names.size === 0 || action.names.has(addressWithoutNamespace)) {
          this.handleAction(action, oscMessage)
            .then(() => {/* maybe add something here */ })
            .catch((error: any) => this.logger.error("An error occurred inside a controller method", error));
        }
      });
    });
  }

}