import sqlite3 from "sqlite3";

// Open the database connection
const db = new sqlite3.Database("../database.db");

// Create a table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sensor TEXT,
    value TEXT,
    unit TEXT,
    time TEXT
  )
`);

export function addData(
  sensor: string,
  value: string,
  unit: string,
  time: Date
): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO data (sensor, value, unit, time) VALUES (?, ?, ?, ?)",
      [sensor, value, unit, time.toISOString()],
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

export function getAllData(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM data", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

export function updateData(
  id: number,
  sensor: string,
  value: string,
  unit: string,
  time: Date
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE users SET sensor = ?, value = ?, unit = ?, time = ? WHERE id = ?",
      [sensor, value, unit, time.toISOString(), id],
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
export function deleteData(id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM data WHERE id = ?", [id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Close the database connection
export function closeDatabase(): void {
  db.close();
}
