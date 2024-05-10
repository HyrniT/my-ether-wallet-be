const walletController = require('../controllers/wallet.controller');
const router = require('express').Router();

// CRUD Routes /wallet
router.get('/create', walletController.createWallet); // /wallet/create
router.get('/:publicKey', walletController.getWallet); // /wallet/:publicKey
// router.get('/balance/:publicKey', walletController.getBalance); // /wallet/balance/:publicKey
// router.get('/transactions/:publicKey', walletController.getTransactions); // /wallet/transactions/:publicKey
router.patch('/balance/:publicKey', walletController.updateBalance); // /wallet/balance/:publicKey

module.exports = router;
