# Deployment
The following describes how to deploy the Mix on a Raspberry Pi.

We used a Raspberry Pi 4 with 4GB of RAM running Raspian Buster. We placed our project files in `~/Project/media-computing-project`, which serves as the base directory for all scripts.

## Setup
The following programs are reqiured to be installed on the Pi:

**TODO: Links**

- Node.js (we used v12.13.1) with npm (we used v6.13.6)
- chromium-browser
- pm2 (we used v4.2.1), a process manager
- sox (we used v14.4.2), a music player

Ensure that you have speakers connected to the Pi *before* you run any scripts.

1. Set up the WiFi hotspot on the Pi. We used this tutorial: https://www.raspberrypi.org/documentation/configuration/wireless/access-point.md
2. Build the GUI by running
    ```
    npm run build:local
    ```
3. To start the Mix automatically when the Pi starts up, add the following line to `/etc/rc.local`: **TODO: Is this really for auto-startup?**
    ```
    bash /home/pi/Projects/media-computing-project/startall.sh
    ``` 

## Starting
If you've not set the Mix to autostart when booting up, you can run the `startall.sh` script manually.

The Pi will output sounds to indicate different stages of the starting process. What you want to hear is the Windows 7 boot-up sound, which indicates that everything has started correctly. If you do not hear it after a few minutes, you have to connect to the Pi and debug...

