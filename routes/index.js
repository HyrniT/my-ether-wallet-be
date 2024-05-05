const express = require('express');
const router = express.Router();

const walletRouter = require('./wallet.route');

router.use('/wallet', walletRouter);

module.exports = router;
