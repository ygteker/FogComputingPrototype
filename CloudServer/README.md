# CloudServer

Welcome to CloudServer! This is a prototype for a fog computing solution that receives messages containing sensor data from an edge. It persists them and sends confirmation for each received message.

## Installation

To get started with CloudServer, follow these steps:

1. Clone the repository: `git clone https://github.com/ygteker/CloudServer.git`
2. Navigate to the project directory: `cd CloudServer`
3. Install the required dependencies: `npm install`

## How it works?

The cloud server receives messages via a websocket from a local component in the a fog network. The received message is restructured and saved in a database. After the message is persisted, the cloud server sends a confirmation message containing the id of the received message to confirm that it was processed.

## Usage

To run CloudServer, use the following command:

```
npm run start:dev
```

This will start the server and make it ready to receive incoming requests.
