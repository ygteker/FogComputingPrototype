# LocalServer

This directory contains the code for the LocalServer component of the Fog Computing Prototype project. The LocalServer component is responsible for receiving data from sensors, processing it, and forwarding it to the Cloud. It includes robust recovery systems to ensure data integrity, even in the event of connectivity issues or component failures.

## Docker Setup

You can run this application using Docker. Follow these steps:

1. Build the Docker image:

   ```
   npm run build:docker
   ```

   it is going to build a docker image named `local-component`

2. Run the Docker container, setting the necessary environment variables:
   ```plaintext
   docker run -d \
     --env MQTT_BROKER_HOST="localhost" \
     --env MQTT_TOPICS="sensor1/value,sensor2/value" \
     --env WS_SERVER_URL="localhost:8080" \
     --env CONFIRMATION_TIMEOUT=5000 \
     --name local-component \
     local-component
   ```

Adjust the environment variables (`MQTT_BROKER_HOST`, `MQTT_TOPICS`, `WS_SERVER_URL`, `CONFIRMATION_TIMEOUT`)

## Environment Variables

If not using Docker, you can also set these environment variables in a `.env` file in the root directory of the project:

```plaintext
MQTT_BROKER_HOST="localhost"
MQTT_TOPICS="sensor1/value,sensor2/value"
WS_SERVER_URL="localhost:8080"
CONFIRMATION_TIMEOUT=5000 (in ms)
```

## Default Parameters

The application uses the following default parameters:

- **CONFIRMATION_TIMEOUT**: 3000

These values can be adjusted by setting the corresponding environment variables.

## How to Run Locally

1. Install dependencies with `npm install`.
2. Start the application with `npm run start:dev`.

## Notes

- This application requires Node.js and npm to be installed on your system if running locally.

## License

This project is licensed under the [MIT License](./LICENSE).
