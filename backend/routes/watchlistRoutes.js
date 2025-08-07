const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');

router.get('/:userId', watchlistController.getWatchlistByUserId);
router.post('/:userId', watchlistController.addToWatchlist);
router.delete('/user/:userId/stock/:stockId', watchlistController.removeFromWatchlist);

module.exports = router;