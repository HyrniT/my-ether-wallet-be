const walletController = require('../controllers/wallet.controller');
const router = require('express').Router();

// CRUD Routes /users
router.get('/create', walletController.createWallet); // /wallet/create
router.get('/:publicKey', walletController.getWallet); // /wallet/:publicKey

module.exports = router;
