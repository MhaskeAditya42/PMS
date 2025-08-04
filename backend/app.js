const express = require('express');
const cors = require('cors');
const app = express();


app.use(cors());
app.use(express.json());

const stockRoutes= require('./routes/stockRoutes.js');
const transactionRoutes = require('./routes/transactionRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const loginRoutes = require('./routes/loginRoutes');
const walletRoutes = require('./routes/walletRoutes');



app.use('/api/portfolio', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/stocks',stockRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/wallet', walletRoutes);

module.exports = app;
