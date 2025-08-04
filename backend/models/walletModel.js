const db = require('../utils/db.js');

exports.getWalletByUserId = (user_id, callback) => {
  const query = 'SELECT wallet_id, user_id, balance, last_updated FROM wallet WHERE user_id = ?';
  db.query(query, [user_id], callback);
};

exports.updateWallet = (user_id, amount_change, callback) => {
  const query = `
    UPDATE wallet 
    SET balance = balance + ?, last_updated = CURRENT_TIMESTAMP 
    WHERE user_id = ?
  `;
  db.query(query, [amount_change, user_id], callback);
};