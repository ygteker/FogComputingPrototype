import { connect } from 'mqtt';
import WebSocket from 'ws';
import { MessageQueue } from './message-queue';
import { SensorDataRepository } from './sensor-data.repository';
import SensorData from './types/data';
import { SensorDataDto } from './types/sensor-data.dto';

// MQTT config
const mqttBrokerHost = 'localhost';
const mqttTopic = 'sensor1/value';

// WebSocket config
const socketAddress = 'localhost:8080';

const socket = new WebSocket(`ws://${socketAddress}`);
const mqttClient = connect(`mqtt://${mqttBrokerHost}`);
const sensorDataRepository = new SensorDataRepository();

const messageQueue = new MessageQueue();

mqttClient.on('connect', () => {
  console.log('Connected to the MQTT broker.');

  mqttClient.subscribe(mqttTopic, (err) => {
    if (!err) {
      console.log(`Subscribed to topic: ${mqttTopic}`);
    }
  });
});

mqttClient.on('message', (topic, payload) => {
  const sensor = topic.split('/')[0];
  console.log(`received data from ${sensor}`, payload.toString());
  const incomingData: SensorDataDto = JSON.parse(payload.toString());
  sensorDataRepository
    .addData(sensor, incomingData.value, 'celsius', incomingData.timestamp)
    .then((id) => {
      console.log(`Stored data with id: ${id}`);
      messageQueue.add$.next({
        id: id,
        sensor: sensor,
        timestamp: incomingData.timestamp,
        value: incomingData.value,
        unit: 'celsius',
      });
    });
});

messageQueue.added$.subscribe((sData) => socket.send(JSON.stringify(sData)));

socket.on('open', () => {
  console.log('Connected to the server');

  socket.on('message', (confirmation) => {
    const parsedConfirmation = JSON.parse(confirmation.toString()) as {
      id: number;
    };
    console.log(
      `Received confirmation for data point with id: ${parsedConfirmation.id}`
    );
    messageQueue.delivered$.next(parsedConfirmation.id);
  });

  socket.on('close', () => {
    console.log('Disconnected from the server');
  });

  socket.on('error', (error) => {
    console.error(`WebSocket error: ${error}`);
  });
});
