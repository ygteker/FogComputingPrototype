import { connect } from 'mqtt';
import { MessageService } from './message.service';
import { SensorDataRepository } from './sensor-data.repository';
import { SensorDataDto } from './types/sensor-data.dto';

// MQTT config
const mqttBrokerHost = 'localhost';
const mqttTopic = 'sensor1/value';

const socketAddress = 'localhost:8080';

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

  mqttClient.subscribe(mqttTopic, (err) => {
    if (!err) {
      console.log(`[MQTT] Subscribed the topic: ${mqttTopic}`);
    }
  });
});

mqttClient.on('message', (topic, payload) => {
  const sensor = topic.split('/')[0];
  console.log(`[MQTT] received data from ${sensor}:`, payload.toString());
  const incomingData: SensorDataDto = JSON.parse(payload.toString());
  sensorDataRepository
    .addData(sensor, incomingData.value, 'celsius', incomingData.timestamp)
    .then((id) => {
      console.log(`[DB] Stored data with id: ${id}`);
      messageService.addMessageToQueue({
        id: id,
        sensor: sensor,
        timestamp: incomingData.timestamp,
        value: incomingData.value,
        unit: 'celsius',
      });
    });
});
