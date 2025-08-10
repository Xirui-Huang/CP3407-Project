const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// RDS Database Connection
const db = mysql.createConnection({
  host: 'gym-db.cnuus686y7dr.ap-southeast-2.rds.amazonaws.com',
  user: 'group7',
  password: 'group7gym',
  database: 'gym_db'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Register general user (from index.html)
app.post('/register', (req, res) => {
  const { username, fullname, phone_number, email } = req.body;
  const sql = 'INSERT INTO Users (username, fullname, phone_number, email) VALUES (?, ?, ?, ?)';
  db.query(sql, [username, fullname, phone_number, email], (err) => {
    if (err) {
      console.error(err);
      res.send('Database Error!');
    } else {
      res.send('Registration successful!');
    }
  });
});

// Search for user (from search.html)
app.get('/search', (req, res) => {
  const username = req.query.username;
  const sql = 'SELECT * FROM Users WHERE username = ?';
  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error(err);
      res.send('Database Error!');
    } else if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('User not found');
    }
  });
});

// Register staff (from online_registration.html)
app.post('/register_staff', (req, res) => {
  const {
    expiry_date, title, name_staff_id, gender, dob,
    telephone, email, emergency_name, emergency_number
  } = req.body;

  const sql = `
    INSERT INTO StaffMembers (
      expiry_date, title, name_staff_id, gender, dob,
      telephone, email, emergency_name, emergency_number
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    expiry_date, title, name_staff_id, gender, dob,
    telephone, email, emergency_name, emergency_number
  ], (err) => {
    if (err) {
      console.error(err);
      res.send('Database Error!');
    } else {
      res.send('Staff Registration Successful!');
    }
  });
});

// Search staff by name_staff_id
app.get('/staff_search', (req, res) => {
  const name_staff_id = req.query.name_staff_id;
  const sql = 'SELECT * FROM StaffMembers WHERE name_staff_id = ?';
  db.query(sql, [name_staff_id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Database Error');
    } else if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Not found');
    }
  });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
