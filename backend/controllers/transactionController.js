const Transaction = require('../models/transactionModel');
const Portfolio = require('../models/portfolioModel');
const Wallet = require('../models/walletModel');


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
//     Portfolio.updatePortfolio(user_id, stock_id, transaction_type === 'SELL' ? -quantity : quantity, price, (updateErr) => {
//       if (updateErr) return res.status(500).json({ error: updateErr });
//       res.status(201).json({ message: 'Transaction created', transaction_id: result.insertId });
//     });
//   });
// };



exports.createTransaction = (req, res) => {
  const { user_id, stock_id, transaction_type, quantity, price } = req.body;
  if (!user_id || !stock_id || !transaction_type || !quantity || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check wallet balance
  Wallet.getWalletByUserId(user_id, (walletErr, walletResults) => {
    if (walletErr) return res.status(500).json({ error: walletErr });
    if (!walletResults.length) return res.status(404).json({ message: 'Wallet not found' });
    const currentBalance = walletResults[0].balance;
    const transactionAmount = quantity * price;
    if (transaction_type === 'BUY' && currentBalance < transactionAmount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    // Create transaction
    Transaction.createTransaction(req.body, (transErr, result) => {
      if (transErr) return res.status(500).json({ error: transErr });
      
      // Update portfolio
      const quantityChange = transaction_type === 'SELL' ? -quantity : quantity;
      Portfolio.updatePortfolio(user_id, stock_id, quantityChange, price, (portErr) => {
        if (portErr) return res.status(500).json({ error: portErr });
        
        // Update wallet
        const amountChange = transaction_type === 'BUY' ? -transactionAmount : transactionAmount;
        Wallet.updateWallet(user_id, amountChange, (walletUpdateErr) => {
          if (walletUpdateErr) return res.status(500).json({ error: walletUpdateErr });
          res.status(201).json({ message: 'Transaction created', transaction_id: result.insertId });
        });
      });
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