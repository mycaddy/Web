#!/usr/bin/env bash
yarn 
yarn build

docker image rm mycaddy-react-app:0.1 
docker build --rm -f Dockerfile -t mycaddy-react-app:0.1 .
docker run --rm -d -p 80:80 mycaddy-react-app:0.1 