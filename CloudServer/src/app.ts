import { WebSocketServer } from 'ws';
import Message from './types';
import { MessageRepository } from './message.repository';
import * as dotenv from 'dotenv';
dotenv.config();

const PORT = parseInt(process.env.PORT || '8080');
const URL = process.env.URL || 'localhost';
const server = new WebSocketServer({ port: PORT });
const repository = new MessageRepository();

server.on('connection', (socket) => {
  console.log('A new client connected');

  socket.on('message', (message) => {
    const parsedMsg = JSON.parse(message.toString());
    console.log(`Received message: ${JSON.stringify(parsedMsg)}`);
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
  const prevEntry = await repository.getDataWithId(message.id);
  if (prevEntry) {
    console.log('Data already exists in the database. Skipping...');
    return;
  }
  repository.addData(message).then((id) => {
    console.log(`Stored data with id: ${id}`);
  });
};

console.log(`WebSocket server is running on ws://${URL}:${PORT}`);
