# How to test without building?

## Overview
- OSC-Server: `mcp-osc.miguel-franken.com` on port `57121`
- Tone Generator: `mcp-tone.miguel-franken.com`
- Frontend: `mcp-frontend.miguel-franken.com`

## Test Sound Generation
1. Open the tone generator in a web browser on your PC (`tone.miguel-franken.com`)
2. Send [OSC messages](http://opensoundcontrol.org/spec-1_0) with your instruments over UDP to the OSC-Server (`mcp-osc.miguel-franken.com` on port `57121`).
3. Hear the generated sound

## Test Frontend
1. Open the frontend in a web browser on you PC (`mcp-frontend.miguel-franken.com`)
2. Send [OSC messages](http://opensoundcontrol.org/spec-1_0) with your instruments over UDP to the OSC-Server (`mcp-osc.miguel-franken.com` on port `57121`).
3. See the changes in the frontend
