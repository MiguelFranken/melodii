import { MetadataBuilder } from './metadata-builder/MetadataBuilder';
import * as OSC from 'osc';
import { IOSCRawMessage, OSCMessage } from '../osc/osc-message';
import { OSCInputMessage } from '../osc/osc-input-message';
import { ActionMetadata } from './metadata/ActionMetadata';
import { ControllerMetadata } from './metadata/ControllerMetadata';

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

    const handler = (oscRawMsg: IOSCRawMessage, timeTag: any, info: any) => {
      console.log('Handle Without Namespace');
      const _msg = new OSCInputMessage(oscRawMsg.address, oscRawMsg.args, info);
      this.handleConnection(controllersWithoutNamespaces, _msg);
    };

    // register controllers without namespaces
    this.io.on("message", handler);

    // register controllers with namespaces
    controllersWithNamespaces.forEach((controller: any) => {
      const _namespace: string | RegExp = controller.namespace;
      let namespace: string;
      if (_namespace instanceof RegExp) {
        // namespace = pathToRegexp(_namespace);
        namespace = '';
      } else {
        namespace = controller.namespace;
      }
      // TODO: filter events mit falschem namespace heraus
      // this.io.of(namespace).on("connection", (socket: any) => {
      console.log("Attached controller to io event 'message'");

      // tslint:disable-next-line:no-shadowed-variable
      const handler = (oscRawMsg: IOSCRawMessage, timeTag: any, info: any) => {
        console.log('Handle With Namespace');

        // parse oc address urls
        const addressUrl = oscRawMsg.address.split('/');
        addressUrl.shift();
        const namespaceUrl = namespace.split('/');
        namespaceUrl.shift();

        if (namespaceUrl.length > addressUrl.length) {
          console.log('doesnt start with namespace ' + namespace + '!');
          return;
        } else {
          for (let i = 0; i < namespaceUrl.length; i++) {
            if (namespaceUrl[i] !== addressUrl[i]) {
              console.log('DOESNT start with namespace ' + namespace + '!');
              return;
            }
          }
        }

        const _msg = new OSCInputMessage(oscRawMsg.address, oscRawMsg.args, info);
        this.handleConnection([controller], _msg);
      };

      this.io.on("message", handler);
    });

    return this;
  }

  private handleAction(action: ActionMetadata, oscMessage: OSCMessage): Promise<any> {
    return Promise.resolve(action.executeAction(oscMessage)); // TODO: Promise unnötig hier
  }

  private handleConnection(controllers: ControllerMetadata[], oscMessage: OSCMessage) {
    console.log(`Must Handle ${controllers.length} Connection(s)`);

    controllers.forEach((controller: ControllerMetadata) => {
      controller.actions.forEach((action) => {
        console.log('Handle action');

        this.handleAction(action, oscMessage)
          .then(() => {
            console.log("Handle Action successful");
          })
          .catch((error: any) => console.log(error));
      });
    });
  }

}
