#!/usr/bin/env bash
docker-compose -f prisma/docker-compose.yml up -d
prisma deploy -p prisma/prisma.yml

yarn build
pm2 delete mycaddy-api
pm2 start dist/index.js --name mycaddy-api
pm2 list
