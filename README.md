<img src="Documentation/logo.png" alt="Logo" height="100px">
<br/><br/>

[GUI](Documentation/gui/gui.md) | [Effect Controller](Documentation/effectcontroller/effectcontroller.md) | [Deployed GUI](http://mcp.miguel-franken.com/) | [Development](Documentation/development/development.md)
<br/>[Deployment](Documentation/deployment.md) | [Client](Documentation/client.md) | [API Documentation](API.md) | [Pi Case](Documentation/picase/picase.md)

# The Mix
The Mix receives control messages wirelessly from the instruments and produces sound output. It runs on a separate device that can be connected to quality loudspeakers. Using your phone or tablet, you can connect to the device and open a GUI to control the Mix.

## Getting started
Typically, the Mix will run on a [Raspberry Pi]. The [Pi] will create a WiFi hotspot to which instruments and devices can connect, and set its own IP so that it is easily reachable. Once inside the [Pi]'s network, you can open the GUI by connecting to its IP on a specific port.

You can also run the Mix on your own machine. Be aware that you might need to modify the instruments such that they connect to your machine instead. Setup instructions can be found in [DEVELOPMENT.md](Documentation/development/development.md).

A final alternative is to use the version hosted at http://mcp.miguel-franken.com/. Again, you would need to ensure that instruments connect to this instance. But it might be the easiest option to simply try out the [local instruments](#local-instruments).

## Hardware
If you are interested in building the box for the [Raspberry Pi], refer to `pibox/`.

We also made an effect controller which is documented in `effectcontroller/`.

[Raspberry Pi]: https://www.raspberrypi.org/
[Pi]: https://www.raspberrypi.org/
