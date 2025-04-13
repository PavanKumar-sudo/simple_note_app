const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// ✅ Define tableName safely from .env (or fallback to 'notes')
const tableName = process.env.DB_TABLE || 'notes';

// Routes
app.get('/api/notes', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM \`${tableName}\` ORDER BY created_at DESC`);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/notes', async (req, res) => {
  const { title, content } = req.body;
  try {
    await pool.query(`INSERT INTO \`${tableName}\` (title, content) VALUES (?, ?)`, [title, content]);
    res.status(201).json({ message: 'Note created successfully' });
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM \`${tableName}\` WHERE id = ?`, [id]);
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error('Error deleting note:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('Backend server is up and running! 🚀');
});
