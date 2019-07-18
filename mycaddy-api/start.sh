#!/usr/bin/env bash
yarn build
pm2 delete mycaddy-api
pm2 start dist/index.js --name mycaddy-api
