const router = require('express').Router();
const blockController = require('../controllers/block.controller');

router.get('/latest', blockController.getLatestBlock);
router.post('/mine', blockController.mineBlock);

module.exports = router;
