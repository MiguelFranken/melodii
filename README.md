<img src="./logo.png" alt="Logo" height="100px">

# The Mix

The Mix receives control messages wirelessly from the instruments and produces sound output. It runs on a separate device that can be connected to quality loudspeakers. Using your phone or tablet, you can connect to the device and open a GUI to control the Mix.

## Getting started
Typically, the Mix will run on a Raspberry Pi. The Pi will create a WiFi hotspot to which instruments and devices can connect, and set its own IP so that it is easily reachable. Once inside the Pi's network, you can open the GUI by connecting to its IP on a specific port.

You can also run the Mix on your own machine. Be aware that you might need to modify the instruments such that they connect to your machine instead. Setup instructions can be found in [DEVELOPMENT.md](./DEVELOPMENT.md).

A final alternative is to use the version hosted at mcp.miguel-franken.com. Again, you would need to ensure that instruments connect to this instance. But it might be the easiest option to try out the instrument-independent features of the Mix.

## Overview
At the top of the GUI is the navigation panel. It offers the following links:

- *Logo*: Link to logo page (default page when first opened).
- *Cog wheel*: Settings.
- *Message bubble*: Incoming message log.
- [Effects](#effects): Effect settings and volume meters for each instruments and the master output.
- Mixer: Volume settings for each instrument and master.
- Cello: A simple instrument.
- Mat, Arc, Box: Configuration controls for the FabBand instruments.
- [Matrix](#matrix): A simple, looping instrument.

## Local instruments
The local instruments are built into the Mix and can be used from the GUI. They can be useful to get yourself familiarized with the GUI, since you do not need to connect an instrument to the Mix.

> Be aware that to combat latency, by default the local instruments will use direct communication. I.e., they will not send messages to the server, but pass them directly to the Mix's sound generator. This means that when you connect to the Mix with another device, you will not hear those sounds, because it will not receive them from the server as they are not sent to the server at all. If you want to hear those sounds, you can ask the Mix to send all messages to server by disabling "Direct communication" in the [settings](#settings). Then, other Mix GUIs will receive these messages from the server they are connected to.

### Matrix
The simplest place to try out the Mix is the Matrix. To get an interactive tutorial, use the "Help > Tutorial" menu in the top left.

The basic idea is that you can place notes on the Matrix by clicking on its cells. Active cells turn a different color. From left to right, notes will be played after each other. Each row represents a different tone. By default, drums are selected and each row represents one piece of a drum kit. Once you have placed some notes, click the play button in the top left.

You can switch between the drums and the piano by clicking on the arrow buttons in the second menu row, or by clicking the button to their left that shows what instrument is currently selected.

To the right of these arrows is a button to clear the currently set notes, a button to select a preset arrangement of notes, and a button to show the velocity settings.

The velocity basically determines the volume of an individual note. By showing the velocity, a bar will appear on the bottom of activated notes. Dragging this bar to the left lowers the note's volume, dragging it to the right increases it.

You can influence the playback speed by dragging the beats per minute (BPM) slider at the middle top of the menu. Higher values play faster, lower values more slowly.

The right-most "menu"-style button will hide the Mix navigation and bring it back. Use this to immerse yourself in your Matrix of sounds.

### Cello
The cello offers an alternative, local instrument to the Matrix. Use it by hovering over or touching the bars, representing different notes. The higher parts of the bar play the sound more loudly, the lower parts more softly. You can play multiple sounds at the same time (though this is easier with touch than with a single mouse).