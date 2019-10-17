import { OSCArgs, OSCInputMessage, OSCMessage } from "./osc-message";
import { OSCServer } from "./osc-server";
import { get, isPresent, Optional } from "./util";

//region Event Handlers
// logs what the sender sent
const messageLogger = (oscMsg: OSCInputMessage) => {
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

// logs who the sender is
const remoteInfoLogger = (oscMsg: OSCInputMessage) => {
  console.log(`Remote address is: '${oscMsg.getInfo().address}'`);
};

// plays a sound for each received message
const playSoundForEachMessage = (_: OSCInputMessage) => {
  console.log("Play sound");
  const note: OSCArgs = {
    type: "i",
    value: 50
  };
  const msg = new OSCMessage("/play/piano", [ note ]);
  ocsServer.sendMessage(msg);
};
//endregion

//region Starting Server
const ocsServer = new OSCServer("0.0.0.0", 57121, "192.168.0.241", 4559);
ocsServer.addMessageListener(messageLogger);
ocsServer.addMessageListener(remoteInfoLogger);
ocsServer.addMessageListener(playSoundForEachMessage);
ocsServer.connect();
//endregion
