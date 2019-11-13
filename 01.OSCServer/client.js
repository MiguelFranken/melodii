var osc = require('osc');
var udp = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 57333,
    metadata: true
});
udp.open();
udp.send({
    address: "/play_note",
    args: [
        {
            type: "s",
            value: "C4"
        }
    ]
}, "127.0.0.1", 57121);