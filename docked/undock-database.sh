#!/bin/bash

sudo docker compose down
sudo docker system prune --all --volumes --force
sudo docker volume ls
echo NOW RUN: sudo docker volume rm VOLUME_NAME
