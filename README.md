# Media Computing Project

## Prerequisite
- [Node](https://nodejs.org/en/)
- [Sonic Pi](https://sonic-pi.net/)
- OSC Controller App (to send osc messages for testing)
    - [iOS](https://apps.apple.com/us/app/clean-osc/id1235192209)
    - [Android](https://play.google.com/store/apps/details?id=com.ffsmultimedia.osccontroller&hl=en) (not tested yet)
    
## Backend
### Starting Point
See `01.Backend/index.ts`. This file starts the server and adds event handlers that are triggered when the server receives an OSC message. 
   
### Run
#### Sonic Pi
- Start Sonic Pi and copy `01.Backend/sonic-pi.rb` from the project directory into the sonic pi coding environment.
- Activate _"Empfange entfernte OSC-Nachrichten"_ in the sonic pi menu (see `Prefs > I/O`).
- Press on `Run`!
- Copy IP and port of sonic pi into `01.Backend/index.ts` (to specify `outputIp` and `outputPort`).
  
#### Starting the OSC-Server & Socket-Server
- `cd 01.Backend`
- `npm run start:refresh` or `npm run start` to disable recompiling when detecting source code changes

#### Controller app for testing
- Get your local IP address or the IP address on which this server runs on (e.g. `192.168.0.241`)
- Start your app and connect to this IP with port `57121`
- When you press buttons on the Controller App you should now hear piano sounds from sonic pi!

## Frontend
### Run
- `cd 02.Frontend` (in new terminal window)
- `npn run start`
- Open your browser and navigate to `http.//localhost:4200`
