const router = require('express').Router();
const blockController = require('../controllers/block.controller');

router.get('/', blockController.getBlocks); // /block
router.get('/:id', blockController.getBlock); // /block/:id
router.get('/latest', blockController.getLatestBlock); // /block/latest
router.post('/mine', blockController.mineBlock); // /block/mine

module.exports = router;
