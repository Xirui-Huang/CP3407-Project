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

// Register general user
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

// Search for user
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

// Register staff
app.post('/register_staff', (req, res) => {
  const {
    expiry_date, title, name_staff_id, gender, dob,
    telephone, email, emergency_name, emergency_number, password
  } = req.body;

  const sql = `
    INSERT INTO StaffMembers (
      expiry_date, title, name_staff_id, gender, dob,
      telephone, email, emergency_name, emergency_number, password
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    expiry_date, title, name_staff_id, gender, dob,
    telephone, email, emergency_name, emergency_number, password
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

// Login staff
app.post('/login_staff', (req, res) => {
  const { name_staff_id, password } = req.body;

  const sql = 'SELECT * FROM StaffMembers WHERE name_staff_id = ?';
  db.query(sql, [name_staff_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.json({ status: 'error' });
    }

    if (results.length === 0) {
      return res.json({ status: 'not_found' });
    }

    const staff = results[0];
    if (staff.password === password) {
      return res.json({ status: 'success' });
    } else {
      return res.json({ status: 'wrong_password' });
    }
  });
});

// Get profile data
app.get('/get_profile', (req, res) => {
  const { name_staff_id } = req.query;
  const sql = 'SELECT * FROM StaffMembers WHERE name_staff_id = ?';
  db.query(sql, [name_staff_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database Error');
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Not found');
    }
  });
});

// Update profile data
app.post('/update_profile', (req, res) => {
  const {
    expiry_date, title, name_staff_id, gender, dob,
    telephone, email, emergency_name, emergency_number
  } = req.body;

  const sql = `
    UPDATE StaffMembers SET
      expiry_date = ?, title = ?, gender = ?, dob = ?, telephone = ?, email = ?, 
      emergency_name = ?, emergency_number = ?
    WHERE name_staff_id = ?
  `;

  db.query(sql, [
    expiry_date, title, gender, dob, telephone, email, emergency_name, emergency_number, name_staff_id
  ], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Database Error');
    } else {
      res.send('Profile updated successfully!');
    }
  });
});

/* ----------- Booking 功能 ----------- */

// 获取当前用户的所有 booking
app.get('/get_bookings', (req, res) => {
  const { name_staff_id } = req.query;
  const sql = 'SELECT * FROM Bookings WHERE name_staff_id = ? ORDER BY booked_on DESC';
  db.query(sql, [name_staff_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database Error');
    }
    res.json(results);
  });
});

// 添加 booking
app.post('/add_booking', (req, res) => {
  const { booking_ref, name_staff_id, booking_date, booking_time, booked_on } = req.body;
  const sql = `
    INSERT INTO Bookings (booking_ref, name_staff_id, booking_date, booking_time, booked_on)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [booking_ref, name_staff_id, booking_date, booking_time, booked_on], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database Error');
    }
    res.send('Booking added successfully!');
  });
});

// 删除 booking
app.delete('/delete_booking', (req, res) => {
  const { booking_ref } = req.query;
  const sql = 'DELETE FROM Bookings WHERE booking_ref = ?';
  db.query(sql, [booking_ref], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database Error');
    }
    res.send('Booking deleted successfully!');
  });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
