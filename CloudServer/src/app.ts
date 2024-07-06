import { WebSocketServer } from 'ws';

// const server = new WebSocket.Server({ port: 8080 });
const server = new WebSocketServer({ port: 8080 });

server.on('connection', (socket) => {
  console.log('A new client connected');

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    //TODO include after network is set up
    // addData("test", message.value, "test", new Date(message.date));
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });

  socket.on('error', () => {
    console.log('Error');
  });

  socket.on('error', (error) => {
    console.error(`WebSocket error: ${error}`);
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
