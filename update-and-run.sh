#!/bin/bash

echo "configuring NVM"
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use --lts

echo "navigating to /home/sevenhills/rockzowski"
cd /home/sevenhills/rockzowski

echo "fetching latest changes"
git fetch

echo "updating to origin/main"
git reset --hard origin/main

echo "installing dependencies"
yarn

echo "starting app"
yarn start &