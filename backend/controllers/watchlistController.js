const Watchlist = require('../models/watchlistModel');

exports.getWatchlistByUserId = (req, res) => {
  const userId = req.params.userId;
  Watchlist.getWatchlistByUserId(userId, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (!results.length) return res.status(404).json({ message: 'Watchlist not found' });
    res.json(results);
  });
};

exports.addToWatchlist = (req, res) => {
  const { userId } = req.params;
  const { stock_id } = req.body;
  if (!stock_id) {
    return res.status(400).json({ error: 'Missing required field: stock_id' });
  }
  Watchlist.addToWatchlist(userId, stock_id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Stock added to watchlist', watchlist_id: result.insertId });
  });
};

exports.removeFromWatchlist = (req, res) => {
  const { userId } = req.params;
  const { stock_id } = req.body;
  if (!stock_id) {
    return res.status(400).json({ error: 'Missing required field: stock_id' });
  }
  Watchlist.removeFromWatchlist(userId, stock_id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Stock removed from watchlist' });
  });
};