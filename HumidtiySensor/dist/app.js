"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt_1 = __importDefault(require("mqtt"));
const brokerUrl = 'mqtt://127.0.0.1:1883';
const topic = 'sensor/temp';
const clientId = 'temp-sensor';
const client = mqtt_1.default.connect(brokerUrl, {
    clientId: clientId,
});
function getRandomTemp() {
    return Math.random() * 100;
}
function publishTemp() {
    const temp = getRandomTemp();
    const message = JSON.stringify({ temp: temp, timestamp: new Date() });
    client.publish(topic, message, { qos: 0, retain: false }, (err) => {
        if (err) {
            console.error('Publishing error', err);
        }
        else {
            console.log('Published temp:', message);
        }
    });
}
client.on('connect', () => {
    console.log('Connected to broker');
    setInterval(publishTemp, 5000);
});
client.on('error', (err) => {
    console.error('Connection error:', err);
});
//# sourceMappingURL=app.js.map