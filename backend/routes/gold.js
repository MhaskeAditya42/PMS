const express = require('express');
const router = express.Router();
const db = require('../utils/db'); // Adjust path if needed

// Constant gold price (₹5000/gram)
const GOLD_PRICE_PER_GRAM = 5000;

// 🟢 Buy Gold
router.post('/buy', (req, res) => {
const { user_id, quantity } = req.body;
if (!user_id || !quantity || quantity <= 0) {
return res.status(400).json({ error: 'Invalid user ID or quantity' });
}

const cost = quantity * GOLD_PRICE_PER_GRAM;

// Step 1: Check wallet balance
const walletCheck = 'SELECT balance FROM wallet WHERE user_id = ?';
db.query(walletCheck, [user_id], (err, walletRes) => {
if (err) return res.status(500).json({ error: err.message });
if (!walletRes.length) return res.status(404).json({ error: 'Wallet not found' });
const balance = walletRes[0].balance;
if (balance < cost) {
  return res.status(400).json({ error: 'Insufficient wallet balance' });
}

// Step 2: Deduct wallet balance
const deductWallet = 'UPDATE wallet SET balance = balance - ? WHERE user_id = ?';
db.query(deductWallet, [cost, user_id], (err) => {
  if (err) return res.status(500).json({ error: err.message });

  // Step 3: Update gold holdings
  const goldSql = `
    INSERT INTO digital_gold (user_id, quantity)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
  `;
  db.query(goldSql, [user_id, quantity], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({
      message: 'Gold purchased successfully',
      quantity,
      cost,
      rate_per_gram: GOLD_PRICE_PER_GRAM
    });
  });
});

});
});

// 🔴 Sell Gold
router.post('/sell', (req, res) => {
const { user_id, quantity } = req.body;
if (!user_id || !quantity || quantity <= 0) {
return res.status(400).json({ error: 'Invalid user ID or quantity' });
}

const earnings = quantity * GOLD_PRICE_PER_GRAM;

// Step 1: Check gold quantity
const goldCheck = 'SELECT quantity FROM digital_gold WHERE user_id = ?';
db.query(goldCheck, [user_id], (err, goldRes) => {
if (err) return res.status(500).json({ error: err.message });
const goldOwned = goldRes[0]?.quantity || 0;
if (goldOwned < quantity) {
  return res.status(400).json({ error: 'Not enough gold to sell' });
}

// Step 2: Deduct gold
const deductGold = 'UPDATE digital_gold SET quantity = quantity - ? WHERE user_id = ?';
db.query(deductGold, [quantity, user_id], (err) => {
  if (err) return res.status(500).json({ error: err.message });

  // Step 3: Add earnings to wallet
  const addWallet = 'UPDATE wallet SET balance = balance + ? WHERE user_id = ?';
  db.query(addWallet, [earnings, user_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({
      message: 'Gold sold successfully',
      quantity_sold: quantity,
      earnings,
      rate_per_gram: GOLD_PRICE_PER_GRAM
    });
  });
});
});
});

// 🔍 Get gold and wallet info
router.get('/:user_id', (req, res) => {
const { user_id } = req.params;

const goldSql = 'SELECT quantity FROM digital_gold WHERE user_id = ?';
const walletSql = 'SELECT balance FROM wallet WHERE user_id = ?';

db.query(goldSql, [user_id], (err, goldRes) => {
if (err) return res.status(500).json({ error: err.message });
const gold = goldRes[0]?.quantity || 0;

db.query(walletSql, [user_id], (err, walletRes) => {
  if (err) return res.status(500).json({ error: err.message });
  const balance = walletRes[0]?.balance || 0;

  res.json({
    gold_quantity: gold,
    wallet_balance: balance,
    rate_per_gram: GOLD_PRICE_PER_GRAM
  });
});
});
});

module.exports = router;