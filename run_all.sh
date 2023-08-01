!#/bin/bash

nohup make _run-local-backend-server &
sleep 30;
nohup make _run-local-room-server &
sleep 30;
nohup make _run-local-web-server &

