const osc = require("osc");

console.log("Starting OSC server..");

// Create an osc.js UDP Port listening on port 57121.
const udp = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 57121,
    metadata: true
});

// Listen for incoming OSC messages.
udp.on("message", (oscMsg: any, timeTag: any, info: any) => {
    console.log("An OSC message just arrived", oscMsg);
    console.log("Remote info is: ", info);
});

// Open the socket.
udp.open();
