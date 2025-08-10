CREATE TABLE Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,   -- 学号
  fullname VARCHAR(100) NOT NULL,         -- 名字
  phone_number VARCHAR(20) NOT NULL,      -- 手机号
  email VARCHAR(100) NOT NULL UNIQUE      -- 邮箱
);

INSERT INTO Users (username, fullname, phone_number, email)
VALUES ('jd118488', 'Letian You', '12345678', '123abc@gmail.com');






/*
CREATE TABLE Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  role ENUM('user','admin') DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Sessions (
  session_id INT AUTO_INCREMENT PRIMARY KEY,
  session_name VARCHAR(100) NOT NULL,
  session_time DATETIME NOT NULL,
  trainer_name VARCHAR(100),
  capacity INT DEFAULT 20
);

CREATE TABLE Bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  session_id INT,
  booking_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (session_id) REFERENCES Sessions(session_id)
);
