# Mixer Specification
The mixer acts as the sound production and manipulation center of the band. The instruments send it commands to produce sounds.
It allows live insight and control over the sound generation.

## Sound generator
The sound generator uses Tone.js and therefore runs inside a browser. It defines an OSC-based schema. These messages define what and how the sounds can be generated and manipulated. It also defines an interface for querying information about the current system.
The sound generator establishes a websocket connection to mitigate connection establishment overhead. It takes care of parsing the messages itself.

## Server
The server mitigates the browser’s incapability to respond to outside connections. It acts purely as a central point of communications which instruments can send messages to that get forwarded to the main sound generator. It does no routing, but simply forwards messages between instruments and the sound generator. It does allow multiple connection options besides websockets, though.
It also serves the web apps containing the sound generator (at `/`) and monitor (at `/monitor`).

## Monitor
The monitor is a web app that queries a sound generator and displays its status, such as the log of received messages or currently registered instruments.
