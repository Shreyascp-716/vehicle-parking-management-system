const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Goat_messi@10',  // your password
  database: 'VPMS'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('✅ Database connected!');
});

// GET all vehicles
app.get('/vehicles', (req, res) => {
  db.query('SELECT * FROM vehicles', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// CREATE a new vehicle
app.post('/vehicles', (req, res) => {
  const { user_id, vehicle_number, vehicle_type } = req.body;
  const sql = 'INSERT INTO vehicles (user_id, vehicle_number, vehicle_type) VALUES (?, ?, ?)';
  db.query(sql, [user_id, vehicle_number, vehicle_type], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Vehicle added', id: result.insertId });
  });
});

// DELETE a vehicle
app.delete('/vehicles/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM vehicles WHERE vehicle_id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Vehicle deleted' });
  });
});

// CREATE a new user
app.post('/users', (req, res) => {
  const { name, email, password, phone, role } = req.body;
  const sql = 'INSERT INTO users (name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, email, password, phone, role], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'User registered', id: result.insertId });
  });
});

// GET all users
app.get('/users', (req, res) => {
  const sql = 'SELECT user_id, name FROM users';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// DELETE a user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE user_id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'User deleted' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

