const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController.js');

router.get('/', transactionController.getAllTransactions);
router.post('/', transactionController.createTransaction);
router.get('/user/:userId', transactionController.getTransactionsByUserId);
router.get('/:id', transactionController.getTransactionById);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;