
// const {createPool} = require("mysql");

// const pool = createPool({
//     host:"localhost",
//     user : "root",
//     password : "n3u3da!",
//     database : "portfolio_manager",
//     connectionLimit : "10"
// });





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


