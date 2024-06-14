#!/bin/sh

# Create network
docker network create fog

# Build image
docker build -t iserver .

# Run container
docker run --rm --name local -p 8080:8080 --network fog iserver