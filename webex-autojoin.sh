#!/bin/bash

URL=$1
PROFILE="headless"

echo "Opening Firefox"
/usr/bin/firefox -P $PROFILE -headless $URL &
