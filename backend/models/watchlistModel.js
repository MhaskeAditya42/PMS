const db = require('../utils/db.js');

exports.getWatchlistByUserId = (user_id, callback) => {
  const query = `SELECT w.watchlist_id, w.user_id, w.stock_id, w.created_at, 
           s.symbol, s.isin, s.series,
           sp.prev_close
    FROM watchlist w 
    JOIN stocks s ON w.stock_id = s.stock_id 
    LEFT JOIN stock_prices sp ON w.stock_id = sp.stock_id
    WHERE w.user_id = ?`;
  db.query(query, [user_id], callback);
};

exports.addToWatchlist = (user_id, stock_id, callback) => {
  const query = 'INSERT INTO watchlist (user_id, stock_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP';
  db.query(query, [user_id, stock_id], callback);
};

exports.removeFromWatchlist = (user_id, stock_id, callback) => {
  const query = 'DELETE FROM watchlist WHERE user_id = ? AND stock_id = ?';
  db.query(query, [user_id, stock_id], (err, result) => {
    if (err) return callback(err);
    callback(null, { success: true, stock_id });
  });
};