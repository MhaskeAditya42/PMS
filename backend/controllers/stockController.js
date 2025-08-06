
const db= require('../utils/db');
const StockPrice = require("../models/stockPriceModel");


exports.getAllStocks = (req, res) => {
  const query = `
    SELECT s.*, sp.low_price, sp.high_price, sp.close_price
    FROM stocks s
    LEFT JOIN (
      SELECT sp1.*
      FROM stock_prices sp1
      INNER JOIN (
        SELECT stock_id, MAX(trade_date) as latest_date
        FROM stock_prices
        GROUP BY stock_id
      ) sp2 ON sp1.stock_id = sp2.stock_id AND sp1.trade_date = sp2.latest_date
    ) sp ON s.stock_id = sp.stock_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching stocks with prices', error: err });
    }
    res.json(results);
  });
};


  exports.getStockById = (req, res) => {
    const stockId = req.params.id;
    db.query('SELECT * FROM stocks WHERE stock_id = ?', [stockId], (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching stock', error: err });
      if (results.length === 0) return res.status(404).json({ message: 'Stock not found' });
      res.json(results[0]);
    });
  };

  exports.createStock = (req, res) => {
  const { symbol, isin,series } = req.body;
  db.query('INSERT INTO stocks (symbol, isin, series) VALUES (?, ?,?)', [symbol, isin,series], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error creating stock', error: err });
    res.status(201).json({ id: result.insertId, symbol, isin });
  });
}

exports.updateStock = (req, res) => {
  const stockId = req.params.id;
  const { symbol, isin, series} = req.body;

  if (!symbol || !isin || !series) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  db.query('UPDATE stocks SET symbol = ?, isin = ? , series= ? WHERE stock_id = ?', [symbol, isin, series, stockId], (err) => {
    if (err) return res.status(500).json({ message: 'Error updating stock', error: err });
    res.json({ message: 'Stock updated' });
  });
};

exports.deleteStock = (req, res) => {
  const stockId = req.params.id;
  db.query('DELETE FROM stocks WHERE stock_id = ?', [stockId], (err) => {
    if (err) return res.status(500).json({ message: 'Error deleting stock', error: err });
    res.json({ message: 'Stock deleted' });
  });
};

exports.getStockPrice = (req, res) => {
  const stockId = req.params.stockId;
  StockPrice.getLastPrice(stockId, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result.length) return res.status(404).json({ message: 'Stock price not found' });
    res.json({ last_price: result[0].last_price });
  });
};



  

