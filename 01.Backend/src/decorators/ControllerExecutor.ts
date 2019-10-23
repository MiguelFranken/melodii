import { MetadataBuilder } from './metadata-builder/MetadataBuilder';
import * as pathToRegexp from "path-to-regexp";
import { ControllerMetadata } from './metadata/types/ControllerMetadata';
import * as OSC from 'osc';
import { ActionMetadata } from './metadata/types/ActionMetadata';
import { IOSCRawMessage, OSCMessage } from '../osc/osc-message';
import { OSCInputMessage } from '../osc/osc-input-message';

export class ControllerExecutor {

  private metadataBuilder: MetadataBuilder;

  constructor(private io: OSC.UDPPort) {
    this.metadataBuilder = new MetadataBuilder();
  }

  public execute(controllerClasses?: Function[]) {
    this.registerControllers(controllerClasses);
  }

  /**
   * Registers controllers.
   */
  private registerControllers(classes?: Function[]): this {
    console.log('Registering controllers..');
    const controllers = this.metadataBuilder.buildControllerMetadata(classes);
    const controllersWithoutNamespaces = controllers.filter((ctrl) => !ctrl.namespace);
    const controllersWithNamespaces = controllers.filter((ctrl) => !!ctrl.namespace);

    console.log("Controllers with namespace: " + controllersWithNamespaces.length);
    console.log("Controllers without namespace: " + controllersWithoutNamespaces.length);

    // register controllers without namespaces
    this.io.on("message", (socket: any) => {
      console.log('RECEIVED SOMETHING WITHOUT NAMESPACE');
      this.handleConnection(controllersWithoutNamespaces, socket);
    });

    // register controllers with namespaces
    controllersWithNamespaces.forEach((controller: any) => {
      let namespace: string | RegExp = controller.namespace;
      if (!(namespace instanceof RegExp)) {
        namespace = pathToRegexp(namespace);
      }
      // TODO: filter events mit falschem namespace heraus
      // this.io.of(namespace).on("connection", (socket: any) => {
      console.log("Attached controller to io event 'message'");

      const func = (oscRawMsg: IOSCRawMessage, timeTag: any, info: any) => {
        const _msg = new OSCInputMessage(oscRawMsg.address, oscRawMsg.args, info);
        this.handleConnection([controller], _msg);
      };

      this.io.on("message", func);
    });

    return this;
  }

  private handleAction(action: ActionMetadata): Promise<any> {
    return Promise.resolve(action.executeAction()); // TODO: Promise so unnötig
  }

  private handleConnection(controllers: ControllerMetadata[], oscMessage: OSCMessage) {
    console.log(`Must Handle ${controllers.length} Connection(s)`);

    controllers.forEach((controller: ControllerMetadata) => {
      controller.actions.forEach((action) => {
        console.log('Handle action');

        this.handleAction(action)
          .then(() => {
            console.log("Handle Action successful");
          })
          .catch((error: any) => console.log(error));
      });
    });
  }

}
