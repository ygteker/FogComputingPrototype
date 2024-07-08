export class SensorData {
  #timestamp: Date;
  #value: number;
  #unit: string | undefined;
  constructor(value: number, unit?: string) {
    this.#value = value;
    this.#timestamp = new Date();
    this.#unit = unit;
  }

  get timestamp() {
    return this.#timestamp;
  }

  get value() {
    return this.#value;
  }

  get unit() {
    return this.#unit;
  }

  stringify() {
    return JSON.stringify({
      timestamp: this.timestamp.toJSON(),
      value: this.value.toFixed(2),
      unit: this.unit,
    });
  }
}
