# API

This file lists all possible osc-messages which the server can handle.

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
<th>Start/Stop reverb</th>
<th>Based on the arg starts or stops the reverb effect on the snare</th>
<th><details><p>

Path:
```
/snare/effect/reverb
```
Arguments:
```
[
    { i,boolean },  // Expects a boolean as integer to start = 1 or stop = 0 
]
```

</p></details></th>
</tr>
<tr style="vertical-align:top;">
<th>Start/Stop pingpongdelay</th>
<th>Based on the arg starts or stops the pingpongdelay effect on the snare</th>
<th><details><p>

Path:
```
/snare/effect/pingpongdelay
```
Arguments:
```
[
    { i,boolean },  // Expects a boolean as integer to start = 1 or stop = 0 
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
    { i,duration },  // Expects the duration of the note as string
    { i,velocity },  // Expects the velocity of the note as float
]
```

</p></details></th>
</tr>
</table>


