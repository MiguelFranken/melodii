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
/snare/play
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
/kick
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
/hihat
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


