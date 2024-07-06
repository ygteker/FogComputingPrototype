export class SensorData {
  #timestamp: Date;
  #value: number;
  constructor(value: number) {
    this.#value = value;
    this.#timestamp = new Date();
  }

  get timestamp() {
    return this.#timestamp;
  }

  get value() {
    return this.#value;
  }

  stringify() {
    return JSON.stringify({
      timestamp: this.timestamp.toJSON(),
      value: this.value.toFixed(2),
    });
  }
}
