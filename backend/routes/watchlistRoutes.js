const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');

router.get('/:userId', watchlistController.getWatchlistByUserId);
router.post('/:userId', watchlistController.addToWatchlist);
router.delete('/:userId', watchlistController.removeFromWatchlist);

module.exports = router;