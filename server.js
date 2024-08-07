const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const ip = require('ip');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Create and connect to SQLite database
const db = new sqlite3.Database(':memory:');

// Create tables
db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, isAdmin BOOLEAN)");
    db.run("CREATE TABLE script_access (ip TEXT UNIQUE)");
});

// User registration endpoint
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    db.run("INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)", [username, password, false], function(err) {
        if (err) {
            res.status(500).send({ message: 'Error registering user' });
        } else {
            res.send({ message: 'User registered successfully' });
        }
    });
});

// User login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
        if (err) {
            res.status(500).send({ success: false });
        } else if (row) {
            res.send({ success: true, isAdmin: row.isAdmin });
        } else {
            res.send({ success: false });
        }
    });
});

// Request script access
app.post('/api/request-script-access', (req, res) => {
    const userIp = ip.address();
    db.get("SELECT * FROM script_access WHERE ip = ?", [userIp], (err, row) => {
        if (err) {
            res.status(500).send({ access: false });
        } else if
