const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool

pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Promisify queries for ease of use
const db = pool.promise();


// Middleware
app.use(express.json());  // To parse JSON bodies
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));  // Enable Cross-Origin Resource Sharing (CORS)


// Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM todos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Create a new todo
app.post('/api/todos', async (req, res) => {
  const { text } = req.body;
  try {
    const [result] = await db.query('INSERT INTO todos (text) VALUES (?)', [text]);
    const newTodo = { _id: result.insertId, text };
    res.json(newTodo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add todo' });
  }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM todos WHERE id = ?', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

