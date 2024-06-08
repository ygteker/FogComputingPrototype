import mqtt from 'mqtt';

const brokerUrl = 'mqtt://127.0.0.1:1883';
const topic = 'sensor/temp';
const clientId = 'temp-sensor';

const client = mqtt.connect(brokerUrl, {
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
    } else {
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
