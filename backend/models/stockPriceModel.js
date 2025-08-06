const db = require('../utils/db');

const StockPrice = {
  getLastPrice: (stockId, callback) => {
    const query = 'SELECT last_price FROM stock_prices WHERE stock_id = ? ORDER BY trade_date DESC LIMIT 1';
    db.query(query, [stockId], (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  }
};

module.exports = StockPrice;