const db = require('../utils/db.js');

exports.getAllTransactions = (callback) => {
  db.query('SELECT * FROM transactions', callback);
};


exports.createTransaction = (transaction, callback) => {
  const query = `
    INSERT INTO transactions (user_id, stock_id, transaction_type, quantity, price)
    VALUES (?, ?, ?, ?, ?)
  `;
  const { user_id, stock_id, transaction_type, quantity, price } = transaction;
  db.query(query, [user_id, stock_id, transaction_type, quantity, price], callback);
};

exports.getTransactionsByUserId = (user_id, callback) => {
  db.query(`SELECT t.*, s.symbol
    FROM transactions t
    JOIN stocks s ON t.stock_id = s.stock_id
    WHERE t.user_id = ?`, [user_id], callback);
};

exports.getTransactionById = (id, callback) => {
  db.query('SELECT * FROM transactions WHERE transaction_id = ?', [id], callback);
};

exports.deleteTransaction = (id, callback) => {
  db.query('DELETE FROM transactions WHERE transaction_id = ?', [id], callback);
};