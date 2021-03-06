<div align="center">

  <img src="Documentation/images/logo.png" alt="Logo" height="150px">
</div>

# The Mix
The Mix receives control messages wirelessly from the instruments and produces sound output. It runs on a separate device that can be connected to quality loudspeakers. Using your phone or tablet, you can connect to the device and open a GUI to control the Mix.

## Getting Started
Typically, the Mix will run on a [Raspberry Pi]. The [Pi] will create a WiFi hotspot to which instruments and devices can connect, and set its own IP so that it is easily reachable. Once inside the [Pi]'s network, you can open the GUI by connecting to its IP on a specific port.
Details on the deployment of the project on the [Pi] can be found in the [DEPLOYMENT.md](Documentation/development/DEPLOYMENT.md).

You can also run the Mix on your own machine. Be aware that you might need to modify the instruments such that they connect to your machine instead. Setup instructions can be found in [DEVELOPMENT.md](Documentation/development/DEVELOPMENT.md).

A final alternative is to use the version hosted at http://mcp.miguel-franken.com/. Again, you would need to ensure that instruments connect to this instance. But it might be the easiest option to simply try out the [local instruments](Documentation/gui/LOCAL_INSTRUMENTS.md).

## Documentation
<a href="Documentation/gui/GUI.md">
    <img src="Documentation/images/gui.png" alt="gui" height="250px">
</a>
<a href="Documentation/development/DEVELOPMENT.md">
    <img src="Documentation/images/development.png" alt="development details" height="250px">
</a>
<a href="Documentation/API.md">
    <img src="Documentation/images/api.png" alt="API documentation" height="250px">
</a>
<a href="Documentation/CLIENT.md">
    <img src="Documentation/images/client.png" alt="Client documentation" height="250px">
</a>
<a href="Documentation/effectcontroller/EFFECT_CONTROLLER.md">
    <img src="Documentation/images/effect-controller.png" alt="effect-controller" height="250px">
</a>
<a href="Documentation/picase/PICASE.md">
    <img src="Documentation/images/box.png" alt="raspberry pi case" height="250px">
</a>

[Raspberry Pi]: https://www.raspberrypi.org/
[Pi]: https://www.raspberrypi.org/
