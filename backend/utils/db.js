
// const {createPool} = require("mysql");

// const pool = createPool({
//     host:"localhost",
//     user : "root",
//     password : "n3u3da!",
//     database : "portfolio_manager",
//     connectionLimit : "10"
// });

// Establishes connection,avoids logging during jest test
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Pass@123',
  database: 'portfolio_manager'
});

// Don’t log inside test environments
if (process.env.NODE_ENV !== 'test') {
  connection.connect(err => {
    if (err) {
      console.error('DB connection error:', err);
    } else {
      console.log('Connected to MySQL');
    }
  });
} else {
  connection.connect(); // skip logging
}

module.exports = connection;

/*
// backend/models/db.js
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'n3u3da!',
  database: 'portfolio_manager'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

module.exports = connection;
*/


