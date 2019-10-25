import { MetadataBuilder } from './metadata-builder/MetadataBuilder';
import * as OSC from 'osc';
import { IOSCRawMessage, OSCMessage } from '../osc/osc-message';
import { OSCInputMessage } from '../osc/osc-input-message';
import { ActionMetadata } from './metadata/ActionMetadata';
import { ControllerMetadata } from './metadata/ControllerMetadata';
import { SocketServer } from "../socket/socket-server";
import { ParamTypes } from "./metadata/types/ParamTypes";

export class ControllerExecutor {

  private metadataBuilder: MetadataBuilder;

  constructor(private io: OSC.UDPPort, private webserver: SocketServer) {
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

    //region register controllers without namespaces
    const handler = (oscRawMsg: IOSCRawMessage, timeTag: any, info: any) => {
      const _msg = new OSCInputMessage(oscRawMsg.address, oscRawMsg.args, info);
      this.handleConnection(controllersWithoutNamespaces, _msg);
    };
    this.io.on("message", handler);
    //endregion

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

      // tslint:disable-next-line:no-shadowed-variable
      const handler = (oscRawMsg: IOSCRawMessage, timeTag: any, info: any) => {
        // parse osc address urls
        const addressUrl = oscRawMsg.address.split('/');
        addressUrl.shift();
        const namespaceUrl = namespace.split('/');
        namespaceUrl.shift();

        if (namespaceUrl.length > addressUrl.length) {
          return;
        } else {
          for (let i = 0; i < namespaceUrl.length; i++) {
            if (namespaceUrl[i] !== addressUrl[i]) {
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

    // compute parameters
    const paramsPromises = action.params
      .sort((param1, param2) => param1.index - param2.index) // nach index sortieren
      .map(param => {
        switch (param.type) {
          case ParamTypes.OSC_MESSAGE:
            return oscMessage;
          case ParamTypes.WEB_SOCKET:
            return this.webserver;
        }
      });

    // after all parameters are computed
    const paramsPromise = Promise.all(paramsPromises).catch(error => {
      console.log("Error during computation params of the controller: ", error);
      throw error;
    });

    return paramsPromise.then(params => {
      return action.executeAction(params);
    });
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
