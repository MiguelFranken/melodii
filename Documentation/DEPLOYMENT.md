# Deployment
The following describes how to deploy the Mix on a Raspberry Pi.

We used a Raspberry Pi 4 with 4GB of RAM running Raspian Buster. We placed our project files in `~/Project/media-computing-project`, which serves as the base directory for all scripts.

## Setup
The following programs are required to be installed on the Pi:

- [Node.js](https://github.com/nodesource/distributions/blob/master/README.md#debinstall) (we used v12.13.1) with npm (we used v6.13.6)
- [chromium-browser](https://itsfoss.com/install-chromium-ubuntu/)
- [http-server](https://github.com/http-party/http-server#readme) (npm i -g http-server) 
- [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/) (we used v4.2.1), a process manager
- [sox](https://wiki.ubuntuusers.de/SoX/) (we used v14.4.2), a music player

Ensure that you have speakers connected to the Pi *before* you run any scripts.

1. Set up the WiFi hotspot on the Pi. We used this tutorial: https://www.raspberrypi.org/documentation/configuration/wireless/access-point.md
2. Build the GUI by running
    ```
    npm run build:local
    ```

## Starting
Run the script `/home/pi/Project/media-computing-project/Hardware/Pi/Scripts/startall.sh`.

The Pi will output sounds to indicate different stages of the starting process. What you want to hear is the Windows 7 boot-up sound, which indicates that everything has started correctly. If you do not hear it after a few minutes, you have to connect to the Pi and debug...

