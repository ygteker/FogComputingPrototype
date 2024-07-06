import 'dotenv/config';
import { SensorData } from './model/sensor-data';
import { connect } from 'mqtt';

const topic = process.env.MQTT_TOPIC;
const brokerHost = process.env.MQTT_BROKER_HOST;

if (!brokerHost) {
  console.error('MQTT Broker hostname not specified!');
  process.exit(1);
}
if (!topic) {
  console.error('MQTT topic not specified!');
  process.exit(1);
}

const client = connect(`mqtt://${brokerHost}`);

client.on('connect', () => {
  console.log('Connected to the broker. Start generating data');
  startGeneratingData(topic);
});

function startGeneratingData(topic: string) {
  const startValue = parseFloat(process.env.INITIAL_VALUE ?? '50');
  const fluctuationSize = parseFloat(process.env.FLUCTUATION_SIZE ?? '1');
  const minValue = parseFloat(process.env.MIN_VALUE ?? '30');
  const maxValue = parseFloat(process.env.MAX_VALUE ?? '80');

  let currentValue = startValue;

  setInterval(() => {
    currentValue = generateNewValue(
      currentValue,
      fluctuationSize,
      minValue,
      maxValue
    );
    console.log(`new value: ${currentValue.toFixed(2)}`);
    const data: SensorData = new SensorData(currentValue);
    client.publish(topic, data.stringify());
  }, 1000);
}

function generateNewValue(
  currentValue: number,
  fluctuationMax: number,
  minValue: number,
  maxValue: number
) {
  const fluctuation = Math.random() * 2 * fluctuationMax - fluctuationMax;
  const newValue = currentValue + fluctuation;
  if (newValue < minValue) return minValue;
  if (newValue > maxValue) return maxValue;
  return newValue;
}
