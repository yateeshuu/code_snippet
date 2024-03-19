// backend/server.js
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'code_snippets_db'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to Code Snippet App!');
});

// Store submitted data into MySQL database
app.post('/submit', (req, res) => {
  const { username, language, stdin, sourceCode } = req.body;
  const timestamp = new Date().toISOString();

  const sql = 'INSERT INTO code_snippets (username, language, stdin, sourceCode, timestamp) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [username, language, stdin, sourceCode, timestamp], (err, result) => {
    if (err) {
      console.error('Error storing code snippet: ', err);
      res.status(500).send('Failed to store code snippet in database.');
      return;
    }
    console.log('Code snippet stored successfully!');
    res.status(200).send('Code snippet stored successfully!');
  });
});
app.delete('/entries/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM code_snippets WHERE id = ?';
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting code snippet: ', err);
      res.status(500).send('Failed to delete code snippet.');
      return;
    }
    console.log('Code snippet deleted successfully!');
    res.status(200).send('Code snippet deleted successfully!');
  });
});

// Get all code snippets
app.get('/entries', (req, res) => {
  const sql = 'SELECT * FROM code_snippets';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching code snippets: ', err);
      res.status(500).send('Failed to fetch code snippets from database.');
      return;
    }
    res.status(200).json(results);
  });
});

// Delete a code snippet by id


// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
