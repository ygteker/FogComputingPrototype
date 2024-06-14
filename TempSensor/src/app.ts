import WebSocket from "ws";

const ws = new WebSocket("ws://172.19.0.2:8080");

ws.on("open", () => {
  setInterval(() => {
    const randomNumber = Math.random() * 15 + 15;
    const message = JSON.stringify({
      temperature: randomNumber.toFixed(1),
      timestamp: new Date().toISOString(),
    });
    ws.send(message);
    console.log(`Sent message: ${message}`);
  }, 5000);
});

ws.on("message", (data) => {
  console.log(`Received message: ${data}`);
});

ws.on("close", () => {
  console.log("WebSocket connection closed");
});
