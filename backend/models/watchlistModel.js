const db = require('../utils/db.js');

exports.getWatchlistByUserId = (user_id, callback) => {
  const query = 'SELECT w.watchlist_id, w.user_id, w.stock_id, w.created_at, s.symbol FROM watchlist w JOIN stocks s ON w.stock_id = s.stock_id WHERE w.user_id = ?';
  db.query(query, [user_id], callback);
};

exports.addToWatchlist = (user_id, stock_id, callback) => {
  const query = 'INSERT INTO watchlist (user_id, stock_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP';
  db.query(query, [user_id, stock_id], callback);
};

exports.removeFromWatchlist = (user_id, stock_id, callback) => {
  const query = 'DELETE FROM watchlist WHERE user_id = ? AND stock_id = ?';
  db.query(query, [user_id, stock_id], callback);
};