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

### Matrix
The simplest place to try out the Mix is the Matrix. To get an interactive tutorial, use the "Help > Tutorial" menu in the top left.

The basic idea is that you can place notes on the Matrix by clicking on its cells. Active cells turn a different color. From left to right, notes will be played after each other. Each row represents a different tone. By default, drums are selected and each row represents one piece of a drum kit. Once you have placed some notes, click the play button in the top left.

You can switch between the drums and the piano by clicking on the arrow buttons in the second menu row, or by clicking the button to their left that shows what instrument is currently selected.

To the right of these arrows is a button to clear the currently set notes, a button to select a preset arrangement of notes, and a button to show the velocity settings.

The velocity basically determines the volume of an individual note. By showing the velocity, a bar will appear on the bottom of activated notes. Dragging this bar to the left lowers the note's volume, dragging it to the right increases it.

You can influence the playback speed by dragging the beats per minute (BPM) slider at the middle top of the menu. Higher values play faster, lower values more slowly.

The right-most "menu"-style button will hide the Mix navigation and bring it back. Use this to immerse yourself in your Matrix of sounds.