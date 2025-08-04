const Portfolio = require('../models/portfolioModel');

exports.getPortfolioByUserId = (req, res) => {
  const userId = req.params.userId;
  Portfolio.getPortfolioByUserId(userId, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results.length) return res.status(404).json({ message: 'Portfolio not found' });
    res.json(results);
  });
};

exports.updatePortfolioOnTransaction = (req, res) => {
  const { userId, stockId } = req.params;
  const { transaction_type, quantity, price } = req.body;
  if (!transaction_type || !quantity || !price) {
    return res.status(400).json({ error: 'Missing required fields: transaction_type, quantity, price' });
  }
  const quantityChange = transaction_type === 'SELL' ? -quantity : quantity;
  Portfolio.updatePortfolio(userId, stockId, quantityChange, price, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json({ message: 'Portfolio updated successfully' });
  });
};