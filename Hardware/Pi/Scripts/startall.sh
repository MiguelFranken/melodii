# delete all logfiles and create new one
path_project="/home/pi/Projects/media-computing-project"
path_sounds="$path_project/Hardware/Pi/Scripts/sounds"
path_frontend="$path_project/Frontend"
path_frontend_log="$path_frontend/log"
path_server="$path_project/Server"
path_server_log="$path_server/log"
logfile="output.log"
chr_logfile="./chrpm2output.log"
frontend_logfile="$path_frontend_log/$logfile"
server_logfile="$path_server_log/$logfile"
chrome_logfile="$path_project/$chr_logfile"

sf="| FRONTEND: | "
if [ ! -d "$path_frontend_log" ]; then
  echo "$sf creating log folder and file"
  mkdir $path_frontend_log
  touch $frontend_logfile
else
  echo "$sf logfile found & deleting content"
  > $frontend_logfile
fi

ss="| SERVER:   | "
if [ ! -d "$path_server_log" ]; then
  echo "$ss creating log folder and file"
  mkdir $path_server_log
  touch $server_logfile
else
  echo "$ss logfile found & deleting content"
  > $server_logfile
fi

sc="| CHROME:   | "
if [ ! -f "$chrome_logfile" ]; then
  echo "$sc creating log file"
  touch $chrome_logfile
else
  echo "$ss logfile found & deleting content"
  > $chrome_logfile
fi

# delete all processes
sp="| PM2:      | "
echo "$sp deleting previous background tasks"
pm2 delete all
sleep 3

# starting frontend
echo "$sf start"

# if you want to build it before using it 
#cd $path_frontend && npm run build:local

cd "$path_frontend/dist/osc-frontend" && pm2 --name frontend --log ../../log/output.log start "http-server -p 4201 -c-1" 

# starting server
echo "$ss start"
cd $path_server && pm2 start npm --name server --log log/output.log -- start


# wait till Server and frontend is up
cd $path_project

st="| TIME:     | "
timeout=20

cons=0
cons_c=0

conf=0
conf_c=0

timer=0
sle=0
while [ $cons == 0 ] || [ $conf == 0 ]
do
  
  sle=0

  # check if server is loaded
  if [ $cons == 0 ] 
  then 
    
    if grep -q "Started listening" Server/log/output.log;
    then
      cons=1
      echo "$ss loaded"
      play -V1 -q $path_sounds/beep.wav
    else
      cons_c=$((cons_c + 1)) 
      echo "$ss still loading..."
      sle=1
    fi
  fi

  # check if frontend is loaded
  if [ $conf == 0 ] 
  then 
    if grep -q "Available on" Frontend/log/output.log;
    then
      conf=1      
      echo "$sf loaded"
      play -V1 -q "$path_sounds/beep.wav"
    else 
      conf_c=$((conf_c + 1))
      echo "$sf still loading..."
      sle=1
    fi
  fi

  # sleep if frontend or server not loaded fully
  if [ $sle == 1 ] 
  then
    timer=$((timer + 5))
    echo "$st passed: $timer s"
    sleep 5
  fi

  if [ $cons_c == $timeout ] || [ $conf_c == $timeout ] 
  then
    echo "$st timeout reached"
    play -V1 -q "$path_sounds/waheffect.wav"
    exit
  fi

done

# start chrome to open mixer
cd $path_project && pm2 --log $chr_logfile --interpreter=bash start chromium-headless.sh 

# wait till chrome is up
cd /home/pi/Projects/media-computing-project/Server/log
con=0
timer=0
while [ $con == 0 ]
do
  if grep -q "has become fully connected" output.log; 
  then
    con=1
    echo "$sc loaded"
    play -V1 -q "$path_sounds/ms-startup.wav"
  else 
    timer=$((timer + 5))
    echo "$sc still loading..."
    echo "$st passed: $timer"
    sleep 5
  fi
done