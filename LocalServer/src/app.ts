import 'dotenv/config';
import { connect } from 'mqtt';
import { MessageService } from './message.service';
import { SensorDataRepository } from './sensor-data.repository';
import { SensorDataDto } from './types/sensor-data.dto';

// MQTT config
const mqttBrokerHost = process.env.MQTT_BROKER_HOST;
const mqttTopics = process.env.MQTT_TOPICS?.split(',');
const socketAddress = process.env.WS_SERVER_URL;

if (!mqttBrokerHost) {
  console.error('MQTT Broker hostname not specified!');
  process.exit(1);
}
if (!mqttTopics) {
  console.error('MQTT topics not specified!');
  process.exit(1);
}
if (!socketAddress) {
  console.error('WebSocket server URL not specified!');
  process.exit(1);
}

const mqttClient = connect(`mqtt://${mqttBrokerHost}`);
const sensorDataRepository = new SensorDataRepository();
const messageService = new MessageService(socketAddress);
messageService.messageDelivered$.subscribe((messageId) =>
  sensorDataRepository.setAsDelivered(messageId)
);
sensorDataRepository
  .getNotDelivered()
  .then((messages) =>
    messages.forEach((message) => messageService.addMessageToQueue(message))
  );

mqttClient.on('connect', () => {
  console.log(`[MQTT] Connected to the broker on ${mqttBrokerHost}`);

  mqttTopics.forEach((topic) => {
    mqttClient.subscribe(topic, (err) => {
      if (!err) {
        console.log(`[MQTT] Subscribed the topic: ${topic}`);
      }
    });
  });
});

mqttClient.on('message', (topic, payload) => {
  const sensor = topic.split('/')[0];
  console.log(`[MQTT] received data from ${sensor}:`, payload.toString());
  const incomingData: SensorDataDto = JSON.parse(payload.toString());
  sensorDataRepository
    .addData(
      sensor,
      incomingData.value,
      incomingData.unit,
      incomingData.timestamp
    )
    .then((id) => {
      console.log(`[DB] Stored data with id: ${id}`);
      messageService.addMessageToQueue({
        id: id,
        sensor: sensor,
        timestamp: incomingData.timestamp,
        value: incomingData.value,
        unit: incomingData.unit,
      });
    });
});
