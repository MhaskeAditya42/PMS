const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

router.get('/:userId', portfolioController.getPortfolioByUserId);
router.put('/:userId/:stockId', portfolioController.updatePortfolioOnTransaction);

module.exports = router;