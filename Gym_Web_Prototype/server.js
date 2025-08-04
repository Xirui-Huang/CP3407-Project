const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

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

// Handle user booking submission
app.post('/bookings', (req, res) => {
  const { email, date, time, bookedOn, reference } = req.body;
  const sql = `INSERT INTO bookings (email, date, time, booked_on, reference) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [email, date, time, bookedOn, reference], (err, result) => {
    if (err) {
      console.error('Error saving booking:', err);
      res.status(500).json({ message: 'Booking failed' });
    } else {
      res.json({ message: 'Booking saved successfully' });
    }
  });
});

// Fetch bookings for current user
app.get('/bookings/:email', (req, res) => {
  const email = req.params.email;
  db.query('SELECT * FROM bookings WHERE email = ?', [email], (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error fetching bookings' });
    } else {
      res.json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// server.js
app.get('/api/profile', (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Profile fetch error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(results[0]);
  });
});