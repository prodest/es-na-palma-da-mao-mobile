#!/bin/bash

cd src/app/shared/settings

wget https://gist.github.com/vizeke/$SETTINGS_ID

cd ../../../..
wget https://gist.github.com/vizeke/$CONFIG_ID

yarn run test:coverage
