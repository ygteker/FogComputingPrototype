# Fog Computing Prototyping Assignment
# LocalServer

Welcome to the LocalServer repository! This repository contains the code for the LocalServer component of the Fog Computing Prototype project.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)

## Introduction

The LocalServer is a crucial component of the Fog Computing Prototype project. It acts as a bridge between the Fog Nodes and the Cloud Server, enabling efficient data processing and communication within the fog computing network.

## Installation

To install and set up the LocalServer, follow these steps:

1. Clone this repository to your local machine.
2. Install the required dependencies by running `npm install`.
3. Start the LocalServer by running `npm run start:dev`.

## Usage

Once the LocalServer is up and running, you can perform various tasks, such as:

- Registering new Fog Nodes.
- Managing data processing and distribution.
- Monitoring the status of connected Fog Nodes.

## How it works?
The local server receives data in the form of JSON with a value and a timestamp from IoT devices, such as sensors, via an MQTT broker in the fog. After receiving it, the data is structured and persisted in a database. The data is then sent to the cloud server via a WebSocket connection. After a message is sent, the local server expects a confirmation message with the corresponding ID from the cloud server. If the confirmation is not received or the connection is interrupted, the remaining messages are queued. For each outgoing message without confirmation, the local server waits for 4 seconds before attempting to send it again. Once the connection is reestablished or a confirmation is received, all the queued messages are sent immediately.

## License

This project is licensed under the [MIT License](./LICENSE).

## CloudServer

### Introduction

CloudServer is a prototype for a fog computing solution that receives messages containing sensor data from an edge. It persists them and sends confirmation for each received message.

### Installation

1. Clone the repository: `git clone https://github.com/ygteker/CloudServer.git`
2. Navigate to the project directory: `cd CloudServer`
3. Install the required dependencies: `npm install`

### How It Works

The cloud server receives messages via a websocket from a local component in the fog network. The received message is restructured and saved in a database. After the message is persisted, the cloud server sends a confirmation message containing the id of the received message to confirm that it was processed.

### Usage

To run CloudServer, use the following command:

```
npm run start:dev
```

This will start the server and make it ready to receive incoming requests.

## LocalServer

### Introduction

LocalServer is a Node.js application that acts as an intermediary between sensors and the cloud server in a fog computing network.

### Installation

1. Clone the repository: `git clone https://github.com/ygteker/LocalServer.git`
2. Navigate to the project directory: `cd LocalServer`
3. Install dependencies: `npm install`

### How It Works

LocalServer collects data from sensors and forwards it to the cloud server. It listens for incoming sensor data via MQTT and sends it to the cloud server via WebSocket.

### Usage

To run LocalServer, use the following command:

```
npm run start:dev
```

### Docker Setup

1. Build the Docker image:

   ```
   npm run build:docker
   ```

   This will build a Docker image named `localserver`.

2. Run the Docker container:
   ```plaintext
   docker run -d \
     --env MQTT_TOPIC="sensor1/value" \
     --env MQTT_BROKER_HOST="localhost" \
     --name localserver-app \
     localserver
   ```
   Adjust environment variables as needed.

## Sensor Data Generator

### Introduction

This Node.js application simulates sensor data and sends it to an MQTT broker at specified intervals.

### Installation

1. Clone the repository: `git clone https://github.com/ygteker/SensorDataGenerator.git`
2. Navigate to the project directory: `cd SensorDataGenerator`
3. Install dependencies: `npm install`

### How It Works

The generator simulates a sensor by sending data to an MQTT broker. The values can fluctuate within defined limits.

### Docker Setup

1. Build the Docker image:

   ```
   npm run build:docker
   ```

   This will build a Docker image named `sensor`.

2. Run the Docker container:
   ```plaintext
   docker run -d \
     --env MQTT_TOPIC="sensor1/value" \
     --env MQTT_BROKER_HOST="localhost" \
     --env INITIAL_VALUE=50 \
     --env FLUCTUATION_SIZE=1 \
     --env MIN_VALUE=30 \
     --env MAX_VALUE=80 \
     --env UNIT="celsius" \
     --name sensor-app \
     sensor
   ```
   Adjust the environment variables as per your MQTT broker configuration and simulation requirements.

### Environment Variables

If not using Docker, you can also set these environment variables in a `.env` file in the root directory of the project:

```plaintext
MQTT_TOPIC="sensor1/value"
MQTT_BROKER_HOST="localhost"
INITIAL_VALUE=50
FLUCTUATION_SIZE=1
MIN_VALUE=30
MAX_VALUE=80
UNIT="celsius"
MESSAGE_INTERVAL=1000 (in ms)
```

Adjust the `MQTT_BROKER_HOST` variable to match your MQTT broker's host address.

### Default Simulation Parameters

- **INITIAL_VALUE**: 50
- **FLUCTUATION_SIZE**: 1
- **MIN_VALUE**: 30
- **MAX_VALUE**: 80
- **MESSAGE_INTERVAL**: 1000

### How to Run Locally

1. Install dependencies with `npm install`.
2. Start the application with `npm run start:dev`.

### Notes

- This application requires Node.js and npm to be installed on your system if running locally.
- Ensure the MQTT broker specified in `MQTT_BROKER_HOST` is running and accessible from the application.
# Sensor Data Generator

This Node.js application generates simulated sensor data and publishes it regularly to an MQTT broker.

## Docker Setup

You can run this application using Docker. Follow these steps:

1. Build the Docker image:

   ```
   npm run build:docker
   ```

   it is going to build a docker image named `sensor`

2. Run the Docker container, setting the necessary environment variables:
   ```plaintext
   docker run -d \
     --env MQTT_TOPIC="sensor1/value" \
     --env MQTT_BROKER_HOST="localhost" \
     --env INITIAL_VALUE=50 \
     --env FLUCTUATION_SIZE=1 \
     --env MIN_VALUE=30 \
     --env MAX_VALUE=80 \
     --env UNIT="celsius" \
     --name sensor-app \
     sensor
   ```

Adjust the environment variables (`MQTT_TOPIC`, `MQTT_BROKER_HOST`, `INITIAL_VALUE`, `FLUCTUATION_SIZE`, `MIN_VALUE`, `MAX_VALUE`, `UNIT`, `MESSAGE_INTERVAL`) as per your MQTT broker configuration and simulation requirements.

## Environment Variables

If not using Docker, you can also set these environment variables in a `.env` file in the root directory of the project:

```plaintext
MQTT_TOPIC="sensor1/value"
MQTT_BROKER_HOST="localhost"
INITIAL_VALUE=50
FLUCTUATION_SIZE=1
MIN_VALUE=30
MAX_VALUE=80
UNIT="celsius",
MESSAGE_INTERVAL=1000 (in ms)
```

Adjust the `MQTT_BROKER_HOST` variable to match your MQTT broker's host address.

## Default Simulation Parameters

The application uses the following default simulation parameters:

- **INITIAL_VALUE**: 50
- **FLUCTUATION_SIZE**: 1
- **MIN_VALUE**: 30
- **MAX_VALUE**: 80
- **MESSAGE_INTERVAL**: 1000

These values can be adjusted by setting the corresponding environment variables.

## How to Run Locally

1. Install dependencies with `npm install`.
2. Start the application with `npm run start:dev`.

## Notes

- This application requires Node.js and npm to be installed on your system if running locally.
- Ensure the MQTT broker specified in `MQTT_BROKER_HOST` is running and accessible from the application.
## Thoguht Process

![Screenshot 2024-07-10 at 19 45 45](https://github.com/ygteker/FogComputingPrototype/assets/30394534/c538c9c0-733f-435d-8a04-173915bf6cae)
![Screenshot 2024-07-10 at 19 45 19](https://github.com/ygteker/FogComputingPrototype/assets/30394534/306868db-f27d-431f-9d8b-daf2362ff73d)
