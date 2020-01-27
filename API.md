# API

This file lists all possible osc-messages which the server can handle.

## Arc

<table style="width:100%;text-align:left;">
<tr style="vertical-align:top;">
<td style="width:15%">Title</td>
<td style="width:30%">Description</td>
<td></td>
</tr>
<tr style="vertical-align:top;">
<td>Set</td>
<td>Sets the volume of the note</td>
<td><details><p>

Path:
```
/arc/set
```
Arguments:
```
[
    { s,note },  // Expects a note as string
    { f,strength },  // Expects the strength in [0, 1] of the note as a float
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Activate/deactivate note</td>
<td>Activates/deactivates a specific note</td>
<td><details><p>

Path:
```
/arc/switch/velocity
```
Arguments:
```
[
    { s,note },  // Expects a note as string without octave at the end
    { i,state },  // Expects a boolean as integer
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Activate/deactivate velocity</td>
<td>Activates/deactivates whether the arc instrument can send velocity for notes</td>
<td><details><p>

Path:
```
/arc/switch/velocity
```
Arguments:
```
[
    { i,state },  // Expects a boolean as integer
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Activate/deactivate velocity reversed mode</td>
<td>Activates/deactivates whether the sent velocity values are reversed</td>
<td><details><p>

Path:
```
/arc/switch/reversed
```
Arguments:
```
[
    { i,state },  // Expects a boolean as integer
]
```

</p></details></td>
</tr>
</table>


## Box

<table style="width:100%;text-align:left;">
<tr style="vertical-align:top;">
<td style="width:15%">Title</td>
<td style="width:30%">Description</td>
<td></td>
</tr>
<tr style="vertical-align:top;">
<td>Start playing a note</td>
<td>Triggers a note to start playing</td>
<td><details><p>

Path:
```
/box/trigger
```
Arguments:
```
[
    { s,note },  // Expects a note as string
    { f,velocity },  // Expects the velocity [0,1] of the note as float
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Detune the Box</td>
<td>Shift the pitch of all notes</td>
<td><details><p>

Path:
```
/box/detune
```
Arguments:
```
[
    { i,cents },  // Expects the pitch-shift in cents as integer
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Stop playing a note</td>
<td>Release a note to stop playing it</td>
<td><details><p>

Path:
```
/box/release
```
Arguments:
```
[
    { s,note },  // Expects a note as string
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Set the volume of the Box</td>
<td>Set the instrument-level volume</td>
<td><details><p>

Path:
```
/box/setVolume
```
Arguments:
```
[
    { f,loudness },  // Expects the new loudness [0,1] as float
]
```

</p></details></td>
</tr>
</table>


## Cello

<table style="width:100%;text-align:left;">
<tr style="vertical-align:top;">
<td style="width:15%">Title</td>
<td style="width:30%">Description</td>
<td></td>
</tr>
<tr style="vertical-align:top;">
<td>Set</td>
<td>Sets the volume of the note</td>
<td><details><p>

Path:
```
/cello/set
```
Arguments:
```
[
    { s,note },  // Expects a note as string
    { f,velocity },  // Expects the strength in [0, 1] of the note as a float
]
```

</p></details></td>
</tr>
</table>


## Drums

<table style="width:100%;text-align:left;">
<tr style="vertical-align:top;">
<td style="width:15%">Title</td>
<td style="width:30%">Description</td>
<td></td>
</tr>
<tr style="vertical-align:top;">
<td>Play Snare</td>
<td>Plays the snare from the snare sampler</td>
<td><details><p>

Path:
```
/drums/snare/play
```
Arguments:
```
[
    { i,duration },  // Expects the duration of the snare note as string
    { i,velocity },  // Expects the velocity of the snare note as float
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Play Snare</td>
<td>Plays the basedrum (kick) from the kick sampler</td>
<td><details><p>

Path:
```
/drums/kick
```
Arguments:
```
[
    { i,duration },  // Expects the duration of the kick note as string
    { i,velocity },  // Expects the velocity of the kick note as float
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Play HiHat</td>
<td>Plays the HiHat from the hihat synth</td>
<td><details><p>

Path:
```
/drums/hihat
```
Arguments:
```
[
    { i,duration },  // Expects the duration of the hihat note as string
    { i,velocity },  // Expects the velocity of the hihat note as float
]
```

</p></details></td>
</tr>
</table>


## Effects

<table style="width:100%;text-align:left;">
<tr style="vertical-align:top;">
<td style="width:15%">Title</td>
<td style="width:30%">Description</td>
<td></td>
</tr>
<tr style="vertical-align:top;">
<td>Switch Instrument Reverb Effect</td>
<td>Adds/removes reverb effect for specified instrument</td>
<td><details><p>

Path:
```
/effect/instrument/reverb
```
Arguments:
```
[
    { s,name },  // Expects the name of the instrument as string
    { f,state },  // Expects 1 (on) or 0 (off) as float (boolean)
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Switch Instrument PingPongDeleay Effect</td>
<td>Adds/removes pingpongdelay effect for specified instrument</td>
<td><details><p>

Path:
```
/effect/instrument/pingpongdelay
```
Arguments:
```
[
    { s,name },  // Expects the name of the instrument as string
    { f,state },  // Expects 1 (on) or 0 (off) as float (boolean)
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Switch Master Reverb Effect</td>
<td>Adds/removes reverb effect to/from master output</td>
<td><details><p>

Path:
```
/effect/master/reverb
```
Arguments:
```
[
    { f,state },  // Expects 1 (on) or 0 (off) as float (boolean)
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Switch Master PingPongDeleay Effect</td>
<td>Adds/removes pingpongdelay effect to/from master output</td>
<td><details><p>

Path:
```
/effect/master/pingpongdelay
```
Arguments:
```
[
    { f,state },  // Expects 1 (on) or 0 (off) as float (boolean)
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Change Decay Master Reverb Effect</td>
<td>Changes the decay of the master reverb effect</td>
<td><details><p>

Path:
```
/effect/master/reverb/decay
```
Arguments:
```
[
    { f,seconds },  // Expects seconds (> 0) as float value
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Change Dry/Wet Master Reverb Effect</td>
<td>Changes the dry/wet ration of the master reverb effect</td>
<td><details><p>

Path:
```
/effect/master/reverb/wet
```
Arguments:
```
[
    { f,ratio },  // Expects the ratio for the wet signal as float value between [0,1]
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Change Delay Time Master PingPongDelay Effect</td>
<td>Changes the delay time between consecutive echos of the master pingpongdelay effect</td>
<td><details><p>

Path:
```
/effect/master/pingpongdelay/delay
```
Arguments:
```
[
    { f,delay },  // Expects the delay in seconds (> 0) as float value
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Change Feedback Master PingPongDelay Effect</td>
<td>Changes the amount of the effected signal which is fed back through the master pingpongdelay effect</td>
<td><details><p>

Path:
```
/effect/master/pingpongdelay/feedback
```
Arguments:
```
[
    { f,feedback },  // Expects a float value between [0,1]
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Switch Master EQ Effect</td>
<td>Adds/removes EQ effect to/from master output</td>
<td><details><p>

Path:
```
/effect/master/eq
```
Arguments:
```
[
    { f,state },  // Expects 1 (on) or 0 (off) as float (boolean)
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Change High Gain Master</td>
<td>Changes the gain applied to the high of the master output</td>
<td><details><p>

Path:
```
/effect/master/eq/high
```
Arguments:
```
[
    { f,decibel },  // Expects an integer between [-20,10]
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Change Mid Gain Master</td>
<td>Changes the gain applied to the mid of the master output</td>
<td><details><p>

Path:
```
/effect/master/eq/mid
```
Arguments:
```
[
    { f,decibel },  // Expects an integer between [-20,10]
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Change Low Gain Master</td>
<td>Changes the gain applied to the low of the master output</td>
<td><details><p>

Path:
```
/effect/master/eq/low
```
Arguments:
```
[
    { f,decibel },  // Expects an integer between [-20,10]
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Switch Instrument EQ Effect</td>
<td>Adds/removes EQ effect for specified instrument</td>
<td><details><p>

Path:
```
/effect/instrument/eq
```
Arguments:
```
[
    { s,name },  // Expects the name of the instrument as string
    { f,state },  // Expects 1 (on) or 0 (off) as float (boolean)
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Change High Gain Instrument</td>
<td>Changes the gain applied to the high of the output of the specified instrument</td>
<td><details><p>

Path:
```
/effect/instrument/eq/high
```
Arguments:
```
[
    { s,name },  // Expects the name of the instrument as string
    { f,decibel },  // Expects an integer between [-20,10]
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Change High Mid Instrument</td>
<td>Changes the gain applied to the mid of the output of the specified instrument</td>
<td><details><p>

Path:
```
/effect/instrument/eq/mid
```
Arguments:
```
[
    { s,name },  // Expects the name of the instrument as string
    { f,decibel },  // Expects an integer between [-20,10]
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Change Low Gain Instrument</td>
<td>Changes the gain applied to the low of the output of the specified instrument</td>
<td><details><p>

Path:
```
/effect/instrument/eq/low
```
Arguments:
```
[
    { s,name },  // Expects the name of the instrument as string
    { f,decibel },  // Expects an integer between [-20,10]
]
```

</p></details></td>
</tr>
</table>


## Mat

<table style="width:100%;text-align:left;">
<tr style="vertical-align:top;">
<td style="width:15%">Title</td>
<td style="width:30%">Description</td>
<td></td>
</tr>
<tr style="vertical-align:top;">
<td>Play a note</td>
<td>Plays a note for a fixed duration</td>
<td><details><p>

Path:
```
/mat/play
```
Arguments:
```
[
    { i,buttonIndex },  // Expects a button index as integer
    { f,velocity },  // Expects the velocity [0,1] of the note as float
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Start playing a note</td>
<td>Triggers a note to start playing</td>
<td><details><p>

Path:
```
/mat/trigger
```
Arguments:
```
[
    { i,index },  // Expects an index between 0 and 7 as integer
    { f,velocity },  // Expects the velocity [0,1] of the note as float
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Stop playing a note</td>
<td>Release a note to stop playing it</td>
<td><details><p>

Path:
```
/mat/release
```
Arguments:
```
[
    { i,index },  // Expects an index between 0 and 7 as integer
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Octave change</td>
<td>Changes the octave of all the playable notes</td>
<td><details><p>

Path:
```
/mat/change_octave
```
Arguments:
```
[
    { i,octave },  // Expects a octave as integer value between 1 and 5
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Root note change</td>
<td>Changes the root note of the scale</td>
<td><details><p>

Path:
```
/mat/change_root
```
Arguments:
```
[
    { s,note },  // Expects a note without octave (e.g. 'C' or 'Db') as string
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Scale change</td>
<td>Changes the scale</td>
<td><details><p>

Path:
```
/mat/change_scale
```
Arguments:
```
[
    { s,scale },  // Expects the scale as string (e.g. 'major' or 'minor')
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Swap two button's notes</td>
<td>Swaps the notes that are assigned to the buttons with the provided indices</td>
<td><details><p>

Path:
```
/mat/swap
```
Arguments:
```
[
    { i,buttonIndex },  // Expects a button index as integer
    { i,buttonIndex },  // Expects a button index as integer
]
```

</p></details></td>
</tr>
<tr style="vertical-align:top;">
<td>Switch Chord Mode</td>
<td>Activates/deactivates chord mode</td>
<td><details><p>

Path:
```
/mat/chords
```
Arguments:
```
[
    { i,state },  // Expects a boolean that expresses whether chords should be played or not
]
```

</p></details></td>
</tr>
</table>


## Piano

<table style="width:100%;text-align:left;">
<tr style="vertical-align:top;">
<td style="width:15%">Title</td>
<td style="width:30%">Description</td>
<td></td>
</tr>
<tr style="vertical-align:top;">
<td>Play Note</td>
<td>Plays a note from the piano sampler</td>
<td><details><p>

Path:
```
/piano/play_note
```
Arguments:
```
[
    { s,note },  // Expects a note as string
    { s,duration },  // Expects the duration of the note as string
    { f,velocity },  // Expects the velocity [0,1] of the note as float
]
```

</p></details></td>
</tr>
</table>


