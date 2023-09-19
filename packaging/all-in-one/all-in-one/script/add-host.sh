#!/bin/bash

set -e

printf "\n# Added by APITable\n127.0.0.1 minio\n127.0.0.1 mysql\n127.0.0.1 rabbitmq\n127.0.0.1 redis\n127.0.0.1 backend-server\n127.0.0.1 databus-server\n127.0.0.1 room-server\n127.0.0.1 imageproxy-server\n127.0.0.1 web-server\n# End of section\n" >> /etc/hosts
