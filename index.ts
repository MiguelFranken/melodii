import { OSCArgs, OSCMessage } from "./osc-message";
import { OSCServer } from "./osc-server";
import { get, isPresent, Optional } from "./util";

//region Event Handlers
const messageLogger = (oscMsg: OSCMessage) => {
  // do something different for each control (e.g. switch, button, slider, ...)
  switch (oscMsg.getType()) {
    case "switch":
      const optOscArg: Optional<OSCArgs> = oscMsg.getFirstArg();
      if (isPresent(optOscArg)) {
        const oscArg: OSCArgs = get<OSCArgs>(optOscArg);
        console.log(`Control of type '${oscMsg.getTypeString()}' updated: `, oscArg.value);
      } else {
        console.log("An error occurred");
      }
      break;

    case "unknown":
      console.log("Received osc message for unknown control! ", oscMsg.getArgs());
      break;
  }
};
const remoteInfoLogger = (oscMsg: OSCMessage) => {
  console.log(`Remote address is: '${oscMsg.getInfo().address}'`);
};
//endregion

//region Starting Server
const ocsServer = new OSCServer();
ocsServer.setup("0.0.0.0", 57121);
ocsServer.addMessageListener(messageLogger);
ocsServer.addMessageListener(remoteInfoLogger);
ocsServer.connect();
//endregion
