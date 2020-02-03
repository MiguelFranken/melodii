<img src="./logo.png" alt="Logo" height="100px">

# Mixer for Media Computing Project

# Playing around
You can try out the basic system at http://mcp.miguel-franken.com/. On the top right you find the Matrix with which you can quickly create some test sounds. If you send messages from your instrument, you can either look at the message log interface, which is available from the message icon, or you can open the browser's console.

# Instruments
OSC is a special format, consisting of the address, the type information, and the parameters. For example, `/method/path ,fs 1.23 E5` would send a message to the address `/method/path`. The type information is the part after the comma, where each character represents a type. In the example, there are two parameters, the first has type float (the `f` in `,fs`) and the second has type string (the `s` in `,fs`). Those two parameters are then given, the float is `1.23` and the string is `E5`.

You can send these messages over WiFi using the UDP protocol. Send a UDP message to port `57121`. The message have the OSC format described above, e. g. `/address ,sf D3 0.03`.


The messages for your instruments are documented in the [`API.md`](./API.md).

# Development
If you are interested in having a closer look at our code, or run the services on your machine, refer to the [DEVELOPMENT.md](./DEVELOPMENT.md).

[tone generator]: http://mcp.miguel-franken.com/generator
[Socket.io]: https://socket.io/
