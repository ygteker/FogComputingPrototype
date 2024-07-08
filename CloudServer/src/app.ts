import { WebSocketServer } from "ws";
import Message from "./types";
import { MessageRepository } from "./message.repository";

// const server = new WebSocket.Server({ port: 8080 });
const server = new WebSocketServer({ port: 8080 });
const repository = new MessageRepository();

server.on("connection", (socket) => {
  console.log("A new client connected");

  socket.on("message", (message: string) => {
    console.log(`Received message: ${message}`);
    //TODO include after network is set up
    const msg = JSON.parse(message) as Message;
    console.log(`Sensor: ${msg.sensor}`);
    addData(msg);
    socket.emit("message", `Message received with id ${msg.id}`);
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });

  socket.on("error", () => {
    console.log("Error");
  });

  socket.on("error", (error) => {
    console.error(`WebSocket error: ${error}`);
  });
});

const addData = async (message: Message) => {
  repository.addData(message).then((id) => {
    console.log(`Stored data with id: ${id}`);
  });
};

console.log("WebSocket server is running on ws://localhost:8080");
