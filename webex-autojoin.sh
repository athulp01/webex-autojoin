#!/bin/bash

URL=$1
PROFILE="headless"

echo "Opening Firefox"
/usr/bin/firefox -P $PROFILE -headless $TOKEN $URL &
pid=$!
echo "Waiting for join"
