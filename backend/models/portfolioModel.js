const db = require('../utils/db.js');

const Portfolio = {
  getPortfolioByUserId: (user_id, callback) => {
    const query = `
      SELECT p.*, 
             s.symbol, 
             s.isin, 
             s.series,
             SUM(CASE WHEN t.transaction_type = 'BUY' THEN t.quantity ELSE -t.quantity END) as current_quantity,
             AVG(CASE WHEN t.transaction_type = 'BUY' THEN t.price END) as avg_buy_price
      FROM user_portfolio p
      LEFT JOIN transactions t ON p.user_id = t.user_id AND p.stock_id = t.stock_id
      LEFT JOIN stocks s ON p.stock_id = s.stock_id
      WHERE p.user_id = ?
      GROUP BY p.user_id, p.stock_id, p.portfolio_id, p.quantity, p.avg_buy_price,
               s.symbol, s.isin, s.series
    `;
    db.query(query, [user_id], callback);
  },

  getPortfolioByUserAndStock: (user_id, stock_id, callback) => {
    const query = `
      SELECT p.*, 
             SUM(CASE WHEN t.transaction_type = 'BUY' THEN t.quantity ELSE -t.quantity END) as current_quantity,
             AVG(CASE WHEN t.transaction_type = 'BUY' THEN t.price END) as avg_buy_price
      FROM user_portfolio p
      LEFT JOIN transactions t ON p.user_id = t.user_id AND p.stock_id = t.stock_id
      WHERE p.user_id = ? AND p.stock_id = ?
      GROUP BY p.user_id, p.stock_id, p.portfolio_id, p.quantity, p.avg_buy_price
    `;
    db.query(query, [user_id, stock_id], callback);
  },

  updatePortfolio: (user_id, stock_id, quantity_change, price, callback) => {
    const checkQuery = 'SELECT * FROM user_portfolio WHERE user_id = ? AND stock_id = ?';
    db.query(checkQuery, [user_id, stock_id], (err, results) => {
      if (err) return callback(err);
      if (results.length > 0) {
        const updateQuery = `
          UPDATE user_portfolio 
          SET quantity = quantity + ?,
              avg_buy_price = (
                (avg_buy_price * (quantity - ?) + ? * ?) / (quantity + ? - ?)
              )
          WHERE user_id = ? AND stock_id = ?
        `;
        db.query(updateQuery, [quantity_change, quantity_change, price, quantity_change, quantity_change, quantity_change, user_id, stock_id], callback);
      } else {
        const insertQuery = `
          INSERT INTO user_portfolio (user_id, stock_id, quantity, avg_buy_price)
          VALUES (?, ?, ?, ?)
        `;
        db.query(insertQuery, [user_id, stock_id, quantity_change, price], callback);
      }
    });
  },
};

module.exports = Portfolio;