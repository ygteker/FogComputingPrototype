"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const server = new ws_1.default.Server({ port: 8080 });
server.on("connection", (socket) => {
    console.log("A new client connected");
    socket.on("message", (message) => {
        console.log("Received message:", message);
        //TODO include after network is set up
        // addData("test", message.value, "test", new Date(message.date));
    });
    socket.on("close", () => {
        console.log("Client disconnected");
    });
});
console.log("WebSocket server is running on ws://localhost:8080");
