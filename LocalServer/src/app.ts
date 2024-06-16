import WebSocket from "ws";
import { addData } from "./db-actions";

const server = new WebSocket.Server({ port: 8080 });

server.on("connection", (socket) => {
  console.log("A new client connected");

  socket.on("message", (message: { value: string; date: string }) => {
    console.log("Received message:", message);
    //TODO include after network is set up
    // addData("test", message.value, "test", new Date(message.date));
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
