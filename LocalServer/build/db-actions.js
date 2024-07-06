"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addData = addData;
exports.getAllData = getAllData;
exports.updateData = updateData;
exports.deleteData = deleteData;
exports.closeDatabase = closeDatabase;
const sqlite3_1 = __importDefault(require("sqlite3"));
// Open the database connection
const db = new sqlite3_1.default.Database("../database.db");
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
function addData(sensor, value, unit, time) {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO data (sensor, value, unit, time) VALUES (?, ?, ?, ?)", [sensor, value, unit, time.toISOString()], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(this.lastID);
            }
        });
    });
}
function getAllData() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM data", (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
}
function updateData(id, sensor, value, unit, time) {
    return new Promise((resolve, reject) => {
        db.run("UPDATE users SET sensor = ?, value = ?, unit = ?, time = ? WHERE id = ?", [sensor, value, unit, time.toISOString(), id], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
// Delete a user by ID
function deleteData(id) {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM data WHERE id = ?", [id], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
// Close the database connection
function closeDatabase() {
    db.close();
}
