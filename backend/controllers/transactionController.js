const Transaction = require('../models/transactionModel');
const Portfolio = require('../models/portfolioModel');
const Wallet = require('../models/walletModel');
const StockPrice = require('../models/stockPriceModel.js');

exports.getAllTransactions = (req, res) => {
  Transaction.getAllTransactions((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createTransaction = (req, res) => {
  const { user_id, stock_id, transaction_type, quantity } = req.body;
  if (!user_id || !stock_id || !transaction_type || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Fetch last_price from stock_prices
  StockPrice.getLastPrice(stock_id, (priceErr, priceResult) => {
    if (priceErr) return res.status(500).json({ error: priceErr });
    if (!priceResult.length) return res.status(404).json({ message: 'Stock price not found' });
    const price = priceResult[0].last_price;
    const transactionAmount = quantity * price;

    // Check wallet balance
    Wallet.getWalletByUserId(user_id, (walletErr, walletResults) => {
      if (walletErr) return res.status(500).json({ error: walletErr });
      if (!walletResults.length) return res.status(404).json({ message: 'Wallet not found' });
      const currentBalance = walletResults[0].balance;
      if (transaction_type === 'BUY' && currentBalance < transactionAmount) {
        return res.status(400).json({ error: 'Insufficient funds' });
      }

      // Check stock availability for SELL transaction
      if (transaction_type === 'SELL') {
        Portfolio.getPortfolioByUserAndStock(user_id, stock_id, (portErr, portResult) => {
          if (portErr) return res.status(500).json({ error: portErr });
          if (!portResult.length) return res.status(404).json({ message: 'Stock not in portfolio' });
          const availableQuantity = portResult[0].quantity;
          if (availableQuantity < quantity) {
            return res.status(400).json({ error: 'Insufficient stock quantity' });
          }
          // Proceed with transaction
          Transaction.createTransaction({ user_id, stock_id, transaction_type, quantity, price }, (transErr, result) => {
            if (transErr) return res.status(500).json({ error: transErr });
            const quantityChange = transaction_type === 'SELL' ? -quantity : quantity;
            Portfolio.updatePortfolio(user_id, stock_id, quantityChange, price, (portUpdateErr) => {
              if (portUpdateErr) return res.status(500).json({ error: portUpdateErr });
              const amountChange = transaction_type === 'BUY' ? -transactionAmount : transactionAmount;
              Wallet.updateWallet(user_id, amountChange, (walletUpdateErr) => {
                if (walletUpdateErr) return res.status(500).json({ error: walletUpdateErr });
                res.status(201).json({ message: 'Transaction created', transaction_id: result.insertId });
              });
            });
          });
        });
      } else {
        // Proceed with BUY transaction
        Transaction.createTransaction({ user_id, stock_id, transaction_type, quantity, price }, (transErr, result) => {
          if (transErr) return res.status(500).json({ error: transErr });
          const quantityChange = transaction_type === 'SELL' ? -quantity : quantity;
          Portfolio.updatePortfolio(user_id, stock_id, quantityChange, price, (portUpdateErr) => {
            if (portUpdateErr) return res.status(500).json({ error: portUpdateErr });
            const amountChange = transaction_type === 'BUY' ? -transactionAmount : transactionAmount;
            Wallet.updateWallet(user_id, amountChange, (walletUpdateErr) => {
              if (walletUpdateErr) return res.status(500).json({ error: walletUpdateErr });
              res.status(201).json({ message: 'Transaction created', transaction_id: result.insertId });
            });
          });
        });
      }
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