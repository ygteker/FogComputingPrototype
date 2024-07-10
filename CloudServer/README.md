# CloudServer

Welcome to CloudServer! This is a prototype for a fog computing solution that receives messages containing sensor data from an edge. It persists them and sends confirmation for each received message.

## Docker Setup

You can run this application using Docker. Follow these steps:

1. Build the Docker image:

   ```
   npm run build:docker
   ```

   it is going to build a docker image named `cloud-component`

2. Run the Docker container, setting the necessary environment variables:
   ```plaintext
   docker run -d \
     --env PORT=8080 \
     --name cloud-component \
     cloud-component
   ```

Adjust the environment variable `PORT`

## Environment Variables

If not using Docker, you can also set these environment variables in a `.env` file in the root directory of the project:

```plaintext
PORT=8080
```

## Default Parameters

The application uses the following default parameters:

- **PORT**: 8080

These values can be adjusted by setting the corresponding environment variables.

## How to Run Locally

1. Install dependencies with `npm install`.
2. Start the application with `npm run start:dev`.

## Notes

- This application requires Node.js and npm to be installed on your system if running locally.

## License

This project is licensed under the [MIT License](./LICENSE).
