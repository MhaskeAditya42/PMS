const db = require('../utils/db.js');

exports.authenticateUser = (username, email, password_hash, callback) => {
  const query = 'SELECT user_id FROM users WHERE username = ? AND email = ? AND password_hash = ?';
  db.query(query, [username, email, password_hash], (err, results) => {
    if (err) return callback(err);
    callback(null, results.length > 0 ? results[0].user_id : null);
  });
};