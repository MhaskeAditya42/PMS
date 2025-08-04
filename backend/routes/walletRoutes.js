const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

router.get('/:userId', walletController.getWalletByUserId);

module.exports = router;