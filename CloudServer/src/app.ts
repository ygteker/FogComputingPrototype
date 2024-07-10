import 'dotenv/config';
import { WebSocketServer } from 'ws';
import Message from './types';
import { MessageRepository } from './message.repository';

const PORT = parseInt(process.env.PORT || '8080');
const server = new WebSocketServer({ port: PORT });
const repository = new MessageRepository();

server.on('connection', (socket) => {
  console.log('[WebSocket] New client connected');

  socket.on('message', (message) => {
    const parsedMsg = JSON.parse(message.toString());
    console.log(`[WebSocket] Received message: ${JSON.stringify(parsedMsg)}`);
    addData(parsedMsg).then(() => {
      console.log('[WebSocket] Confirmation sent for id: ' + parsedMsg.id);
      socket.send(JSON.stringify({ id: parsedMsg.id }));
    });
  });

  socket.on('close', () => {
    console.log('[WebSocket] Client disconnected');
  });

  socket.on('error', (error) => {
    console.error(`[WebSocket] WebSocket error: ${error}`);
  });
});

const addData = async (message: Message) => {
  const prevEntry = await repository.getDataWithId(message.id);
  if (prevEntry) {
    console.log('[DB] Data already exists in the database. Skipping...');
    return;
  }
  repository.addData(message).then((id) => {
    console.log(`[DB] Stored data with id: ${id}`);
  });
};

console.log(`[WebSocket] WebSocket server is running on port:${PORT}`);
