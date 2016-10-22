#!/bin/bash

cd src/components/shared/settings

wget https://gist.github.com/vizeke/$SETTINGS_ID

cd ../../../..
wget https://gist.github.com/vizeke/$CONFIG_ID

npm run test:coverage
