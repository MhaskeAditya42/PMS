const Transaction = require('../models/transactionModel');
const Portfolio = require('../models/portfolioModel');

exports.getAllTransactions = (req, res) => {
  Transaction.getAllTransactions((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// exports.createTransaction = (req, res) => {
//   const { user_id, stock_id, transaction_type, quantity, price } = req.body;
//   if (!user_id || !stock_id || !transaction_type || !quantity || !price) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }
//   Transaction.createTransaction(req.body, (err, result) => {
//     if (err) return res.status(500).json({ error: err });
//     res.status(201).json({ message: 'Transaction created', transaction_id: result.insertId });
//   });
// };


exports.createTransaction = (req, res) => {
  const { user_id, stock_id, transaction_type, quantity, price } = req.body;
  if (!user_id || !stock_id || !transaction_type || !quantity || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  Transaction.createTransaction(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    Portfolio.updatePortfolio(user_id, stock_id, transaction_type === 'SELL' ? -quantity : quantity, price, (updateErr) => {
      if (updateErr) return res.status(500).json({ error: updateErr });
      res.status(201).json({ message: 'Transaction created', transaction_id: result.insertId });
    });
  });
};


exports.getTransactionsByUserId = (req, res) => {
  const userId = req.params.userId;
  Transaction.getTransactionsByUserId(userId, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getTransactionById = (req, res) => {
  const transactionId = req.params.id;
  Transaction.getTransactionById(transactionId, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (!result.length) return res.status(404).json({ message: 'Transaction not found' });
    res.json(result[0]);
  });
};

exports.deleteTransaction = (req, res) => {
  const transactionId = req.params.id;
  Transaction.deleteTransaction(transactionId, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Transaction deleted' });
  });
};