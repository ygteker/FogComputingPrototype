import { WebSocketServer } from 'ws';
import Message from './types';
import { MessageRepository } from './message.repository';

const server = new WebSocketServer({ port: 8080 });
const repository = new MessageRepository();

server.on('connection', (socket) => {
  console.log('A new client connected');

  socket.on('message', (message) => {
    const parsedMsg = JSON.parse(message.toString());
    console.log(`Received message: ${parsedMsg}`);
    //TODO include after network is set up
    addData(parsedMsg).then(() => {
      socket.send(JSON.stringify({ id: parsedMsg.id }));
    });
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

const addData = async (message: Message) => {
  repository.addData(message).then((id) => {
    console.log(`Stored data with id: ${id}`);
  });
};

console.log('WebSocket server is running on ws://localhost:8080');
