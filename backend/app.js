const express = require('express');
const cors = require('cors');
const app = express();


app.use(cors());
app.use(express.json());

const stockRoutes= require('./routes/stockRoutes.js');
const transactionRoutes = require('./routes/transactionRoutes');

app.use('/api/transactions', transactionRoutes);
app.use('/api/stocks',stockRoutes);


module.exports = app;
