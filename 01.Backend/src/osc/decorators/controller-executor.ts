import { MetadataBuilder } from './metadata-builder/metadata-builder';
import * as OSC from 'osc';
import { OSCInputMessage } from '../osc-input-message';
import { ActionMetadata } from './metadata/action-metadata';
import { ControllerMetadata } from './metadata/controller-metadata';
import { ParamTypes } from "./metadata/types/param-types";
import { Logger } from "@overnightjs/logger";
import { IOSCRawMessage } from "../osc-types";

export class ControllerExecutor {

  private metadataBuilder: MetadataBuilder;

  constructor(private io: OSC.UDPPort) {
    this.metadataBuilder = new MetadataBuilder();
  }

  public execute(controllerClasses?: Function[]) {
    if (controllerClasses) {
      console.log(controllerClasses.length);
    }
    this.registerControllers(controllerClasses);
  }

  /**
   * Registers controllers.
   */
  private registerControllers(classes?: Function[]): this {
    const controllers = this.metadataBuilder.buildControllerMetadata(classes);
    const controllersWithoutNamespaces = controllers.filter((ctrl) => !ctrl.namespace);
    const controllersWithNamespaces = controllers.filter((ctrl) => !!ctrl.namespace);

    console.log("Controller with namespaces: " + controllersWithNamespaces.length);
    console.log("Controller without namespaces: " + controllersWithoutNamespaces.length);

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
      if (_namespace instanceof RegExp) { // TODO MF: implement the RegExp feature
        // namespace = pathToRegexp(_namespace);
        namespace = '';
      } else {
        namespace = controller.namespace;
      }

      // tslint:disable-next-line:no-shadowed-variable
      const handlerWithNamespace = (oscRawMsg: IOSCRawMessage, timeTag: any, info: any) => {
        // parse osc address urls (e.g. "/sub1/sub2" -> ["", "sub1", "sub2"])
        const addressUrl = oscRawMsg.address.split('/');
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

        const _msg = new OSCInputMessage(oscRawMsg.address, oscRawMsg.args, info);
        this.handleConnection([controller], _msg);
      };

      this.io.on("message", handlerWithNamespace);
    });

    return this;
  }

  private handleAction(action: ActionMetadata, oscMessage: OSCInputMessage): Promise<any> {
    // compute parameters
    const paramsPromises = action.params
      .sort((param1, param2) => param1.index - param2.index) // nach index sortieren
      .map(param => {
        // TODO MF: add more param types here in the future if necessary
        switch (param.type) {
          case ParamTypes.OSC_MESSAGE:
            return oscMessage;
        }
      });

    // after all parameters are computed
    const paramsPromise = Promise.all(paramsPromises).catch(error => {
      Logger.Err("Error during computation params of the controller: ", error);
      throw error;
    });

    return paramsPromise.then(params => {
      return action.executeAction(params);
    });
  }

  private handleConnection(controllers: ControllerMetadata[], oscMessage: OSCInputMessage) {
    controllers.forEach((controller: ControllerMetadata) => {
      controller.actions.forEach((action) => {
        const addressWithoutNamespace = oscMessage.getAddress().replace(controller.namespace, '');
        if (action.names.size === 0 || action.names.has(addressWithoutNamespace)) {
          this.handleAction(action, oscMessage)
            .then(() => {/* maybe add something here */})
            .catch((error: any) => Logger.Err(error));
        }
      });
    });
  }

}
