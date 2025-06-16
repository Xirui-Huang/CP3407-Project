const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// 解析表单
app.use(bodyParser.urlencoded({ extended: true }));

// 把 index.html 作为首页
app.use(express.static(__dirname));

// RDS 连接信息
const db = mysql.createConnection({
  host: 'gym-db.cnuus686y7dr.ap-southeast-2.rds.amazonaws.com',
  user: 'group7',
  password: 'group7gym',
  database: 'gym_db' // 比如 gymdb
});

// 注册路由
app.post('/register', (req, res) => {
  const { username, fullname, phone_number, email } = req.body;
  const sql = 'INSERT INTO Users (username, fullname, phone_number, email) VALUES (?, ?, ?, ?)';
  db.query(sql, [username, fullname, phone_number, email], (err, result) => {
    if (err) {
      console.error(err);
      res.send('Database Error!');
    } else {
      res.send('Registration successful!');
    }
  });
});

// 查询路由
app.get('/search', (req, res) => {
  const username = req.query.username;
  const sql = 'SELECT * FROM Users WHERE username = ?';
  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error(err);
      res.send('Database Error!');
    } else {
      if (results.length > 0) {
        // 找到就返回 JSON
        res.json(results[0]);
      } else {
        // 没找到就重定向到注册页面
        res.redirect('/index.html');
      }
    }
  });
});

// 启动服务器
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
