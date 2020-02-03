# DEPLOY -- the project on the pi

Documentation for using the mcp-project named mixer on a raspberry pi.

In our case we used a raspberry pi 4 with 4 gb ram but that is probably 
unnecessary.
The operating system is Raspian-Buster.

Our project is deployed and installed under ~/Project/media-computing-project.
Therefore all used scripts are using this path as root path.

For starting the mixer like we did, a few things are required:
- some installations: 
  - npm (we use v6.13.6)
  - node (we use v12.13.1)
  - chromium-browser
  - pm2 (we use v4.2.1 -> process manager)
  - sox (we use v14.4.2 -> music player)
- some speaker would be nice (plug them in before starting any scripts)
- configure the pi as access-point so the instruments can connect to it:
  - heres a tutorial: https://www.raspberrypi.org/documentation/configuration/wireless/access-point.md
  
After the git project and all the other things are set up we have to build the Frontend with 
```
npm run build:local
```
Now we can add the folowing line to the /etc/rc.local:
```
bash /home/pi/Projects/media-computing-project/startall.sh
``` 

If you hear the windows 7 loading sound after a while you done everything right if not maybe you should reconsider your setup.

