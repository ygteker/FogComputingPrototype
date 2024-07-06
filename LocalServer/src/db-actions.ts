import sqlite3, { Database } from 'sqlite3';

export class SensorDataRepository {
  #db: Database;
  constructor() {
    this.#db = new sqlite3.Database('database.db');
    this.#db.run(`
  CREATE TABLE IF NOT EXISTS data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sensor TEXT,
    value TEXT,
    unit TEXT,
    timestamp TEXT
  )
`);
  }
  addData(
    sensor: string,
    value: string,
    unit: string,
    timestamp: string
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      this.#db.run(
        'INSERT INTO data (sensor, value, unit, timestamp) VALUES (?, ?, ?, ?)',
        [sensor, value, unit, timestamp],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }

  getAllData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.#db.all('SELECT * FROM data', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  updateData(
    id: number,
    sensor: string,
    value: string,
    unit: string,
    timestamp: Date
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.#db.run(
        'UPDATE data SET sensor = ?, value = ?, unit = ?, timestamp = ? WHERE id = ?',
        [sensor, value, unit, timestamp.toISOString(), id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  // Delete a user by ID
  deleteData(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.#db.run('DELETE FROM data WHERE id = ?', [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Close the database connection
  closeDatabase(): void {
    this.#db.close();
  }
}
