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
     --env MESSAGE_INTERVAL=1000 \
     --name sensor \
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

## License

This project is licensed under the [MIT License](./LICENSE).
