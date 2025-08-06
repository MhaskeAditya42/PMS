const Wallet = require('../models/walletModel');

exports.getWalletByUserId = (req, res) => {
  const userId = req.params.userId;
  Wallet.getWalletByUserId(userId, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results.length) return res.status(404).json({ message: 'Wallet not found' });
    res.json(results[0]);
  });
};

exports.updateWalletOnTransaction = (req, res, next) => {
  const { user_id } = req.body;
  const { transaction_type, quantity, price } = req.body;
  if (!user_id || !transaction_type || !quantity || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const amount_change = transaction_type === 'BUY' ? -(quantity * price) : (quantity * price);
  Wallet.updateWallet(user_id, amount_change, (err) => {
    if (err) return res.status(500).json({ error: err });
    next();
  });
};

exports.addBalanceToWallet = (req, res) => {
  const { user_id, amount } = req.body;

  if (!user_id || amount === undefined) {
    return res.status(400).json({ error: 'Missing user_id or amount' });
  }

  if (amount <= 0) {
    return res.status(400).json({ error: 'Amount must be greater than zero' });
  }

  Wallet.updateWallet(user_id, amount, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json({ message: 'Balance added successfully' });
  });
};
