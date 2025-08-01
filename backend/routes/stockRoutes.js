const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.get('/',stockController.getAllStocks);
router.get('/:id', stockController.getStockById);

module.exports= router;