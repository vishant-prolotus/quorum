#!/bin/bash

cd "/home/ubuntu/quorum.5rtgs.demo"

node_port="3216"

listening="`lsof -i:$node_port`"

for pid in $(ps aux | grep supervisor | awk '{print $2}')
do
kill -9 $pid &> /dev/null
done && echo "[+] PIDs Killed"
kill -9 $(lsof -i:$node_port |awk '{print $2}') &> /dev/null

sleep 1
if [ -z "$listening" ] ; then
#    /usr/local/bin/supervisor app.js > /dev/null &
     /usr/local/bin/supervisor app.js &> /home/ubuntu/quorum_5rtgs.log &
    sleep 1
    echo "[+] Node App Started"
else
    echo "[+] Node App Already Running"
fi

## E O F ##

