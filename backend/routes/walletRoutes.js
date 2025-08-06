const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

router.get('/:userId', walletController.getWalletByUserId);
router.put('/update', walletController.updateWalletOnTransaction);
router.post('/add', walletController.addBalanceToWallet);



module.exports = router;