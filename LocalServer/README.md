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
