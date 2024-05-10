const router = require('express').Router();
const transactionController = require('../controllers/transaction.controller');

// CRUD Routes /transaction
router.get('/', transactionController.getTransactions); // /transaction
router.post('/send', transactionController.sendTransaction); // /transaction/send
router.get('/pending', transactionController.getPendingTransactions); // /transaction/pending
router.get('/:hash', transactionController.getTransaction); // /transaction/:hash

module.exports = router;
