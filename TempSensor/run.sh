#!/bin/bash

# create image
docker build -t itmep .

# run container
docker run --rm --name temp --network fog itmep