const express = require('express');
const router = express.Router();

const walletRouter = require('./wallet.route');
const transactionRouter = require('./transaction.route');

router.use('/wallet', walletRouter);
router.use('/transaction', transactionRouter);

module.exports = router;
