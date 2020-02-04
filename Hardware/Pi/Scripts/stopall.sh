# delete all logfiles and create new one
path_project="/home/pi/Projects/media-computing-project"
path_scripts="$path_project/Hardware/Pi/Scripts"
path_sounds="$path_scripts/sounds"
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
if [ -d "$path_frontend_log" ]; then
  echo "$sf deleting log folder and file"
  rm -r $path_frontend_log
else
  echo "$sf no logfolder found"
fi

ss="| SERVER:   | "
if [ -d "$path_server_log" ]; then
  echo "$ss deleting log folder and file"
  rm -r $path_server_log
else
  echo "$ss no logfolder found"
fi

sc="| CHROME:   | "
if [ -f "$chrome_logfile" ]; then
  echo "$sc deleting log file"
  rm $chrome_logfile
else
  echo "$ss no logfile found"
fi

# delete all processes
sp="| PM2:      | "
echo "$sp deleting all running processes"
pm2 delete all
