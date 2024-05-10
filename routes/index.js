const express = require('express');
const router = express.Router();

const walletRouter = require('./wallet.route');
const transactionRouter = require('./transaction.route');
const blockRouter = require('./block.route');

router.use('/wallet', walletRouter);
router.use('/transaction', transactionRouter);
router.use('/block', blockRouter);

module.exports = router;
