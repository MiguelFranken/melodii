<img src="./logo.png" alt="Logo" height="100px">

# Mixer for Media Computing Project

# Playing around
You can try out the basic system using the [Matrix]. Since the Matrix acts like an instrument, you need to also open the [tone generator] to hear sounds.

# Instruments
The following OSC methods are described in a special format, consisting of the address, the type information, and the parameters. For example, `/method/path ,fs 1.23 E5` would send a message to the address `/method/path`. The type information is the part after the comma, where each character represents a type. In the example, there are two parameters, the first has type float (the `f` in `,fs`) and the second has type string (the `s` in `,fs`). Those two parameters are then given, the float is `1.23` and the string is `E5`.

There are several you can send these messages.
- UDP: Send a UDP message to port `57121`. The message have the OSC format described above, e. g. `/address ,sf D3 0.03`.
- Websocket: Connect with [Socket.io] (normal websockets do *not* currently work) to port `8080`. Send a message for the event `"redirect-osc-message"` containing JSON of the format:
  ```
  socket.emit("redirect-osc-message", {
      address: "/method/path",
      args: [
          {
              type: "s",
              value: "D3"
          },
          {
              type: "f",
              value: 0.03
          }
      ]
  });
  ```

## Arc
- `/arc/set <note> <strength>`
  - `<note>` is a note name like `"C4"` or `"Db5"`.
  - `<strength>` is the loudness of the note like `0.2` or `1` (from the closed interval [0, 1]).

  Sets the loudness of the note.
  
  To fade a note, send many messages setting the note with increasing strength. To stop a note, set its strength to 0.

## Box
- `/box/trigger <note> <velocity>`
  - `<note>` is a note name like `"C4"` or `"Db5"`.
  - `<velocity>` is the loudness of the note like `0.2` or `1` (from the closed interval [0, 1]).

  Starts playing the note.

  Note that this method only starts a note. It will keep playing until you send a `/box/release` message for that note.

- `/box/release <note>`
  - `<note>` is a note name like `"C4"` or `"Db5"`.

  Stops playing a note.

- `/box/detune <note> <cents>`
  - `<note>` is a note name like `"C4"` or `"Db5"`.
  - `<cents>` determines how much to shift the pitch, measured in cents. A cent is a hundredth of a semitone, so an octave is 1200 cents.

  Sets the pitch shift of the note.

## Mat
*To be implemented.*


[matrix]: http://mcp.miguel-franken.com
[tone generator]: http://mcp.miguel-franken.com/generator
[Socket.io]: https://socket.io/