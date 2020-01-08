# API

This file lists all possible osc-messages which the server can handle.

## Arc

<table style="width:100%;text-align:left;">
<tr style="vertical-align:top;">
<th style="width:15%">Title</th>
<th style="width:30%">Description</th>
<th></th>
</tr>
<tr style="vertical-align:top;">
<th>Set</th>
<th>Sets the volume of the note</th>
<th><details><p>

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

</p></details></th>
</tr>
</table>


## Box

<table style="width:100%;text-align:left;">
<tr style="vertical-align:top;">
<th style="width:15%">Title</th>
<th style="width:30%">Description</th>
<th></th>
</tr>
<tr style="vertical-align:top;">
<th>Start playing a note</th>
<th>Triggers a note to start playing</th>
<th><details><p>

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

</p></details></th>
</tr>
<tr style="vertical-align:top;">
<th>Detune a note</th>
<th>Shift the pitch of a note</th>
<th><details><p>

Path:
```
/box/detune
```
Arguments:
```
[
    { s,note },  // Expects a note as string
    { i,cents },  // Expects the pitch-shift in cents as integer
]
```

</p></details></th>
</tr>
<tr style="vertical-align:top;">
<th>Stop playing a note</th>
<th>Release a note to stop playing it</th>
<th><details><p>

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

</p></details></th>
</tr>
</table>


## Drums

<table style="width:100%;text-align:left;">
<tr style="vertical-align:top;">
<th style="width:15%">Title</th>
<th style="width:30%">Description</th>
<th></th>
</tr>
<tr style="vertical-align:top;">
<th>Play Snare</th>
<th>Plays the snare from the snare sampler</th>
<th><details><p>

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

</p></details></th>
</tr>
<tr style="vertical-align:top;">
<th>Play Snare</th>
<th>Plays the basedrum (kick) from the kick sampler</th>
<th><details><p>

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

</p></details></th>
</tr>
<tr style="vertical-align:top;">
<th>Play HiHat</th>
<th>Plays the HiHat from the hihat synth</th>
<th><details><p>

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

</p></details></th>
</tr>
</table>


## Mat

<table style="width:100%;text-align:left;">
<tr style="vertical-align:top;">
<th style="width:15%">Title</th>
<th style="width:30%">Description</th>
<th></th>
</tr>
<tr style="vertical-align:top;">
<th>Play a note</th>
<th>Plays a note for a fixed duration</th>
<th><details><p>

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

</p></details></th>
</tr>
<tr style="vertical-align:top;">
<th>Swap two button's notes</th>
<th>Swaps the notes that are assigned to the buttons with the provided indices</th>
<th><details><p>

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

</p></details></th>
</tr>
</table>


## Piano

<table style="width:100%;text-align:left;">
<tr style="vertical-align:top;">
<th style="width:15%">Title</th>
<th style="width:30%">Description</th>
<th></th>
</tr>
<tr style="vertical-align:top;">
<th>Play Note</th>
<th>Plays a note from the piano sampler</th>
<th><details><p>

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

</p></details></th>
</tr>
</table>


