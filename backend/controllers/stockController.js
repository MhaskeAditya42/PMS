
const db= require('../utils/db');

exports.getAllStocks = (req, res) => {
    db.query('SELECT * FROM stocks', (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching stocks', error: err });
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

  

