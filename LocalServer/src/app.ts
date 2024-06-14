import WebSocket from "ws";

const server = new WebSocket.Server({ port: 8080 });

server.on("connection", (socket) => {
  console.log("A new client connected");

  socket.on("message", (message) => {
    console.log("Received message:", message);
    // Handle the incoming message here
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
