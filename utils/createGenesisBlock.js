const db = require('../models');

const createGenesisBlock = async () => {
  try {
    const block = await db.Block.findOne();
    if (!block) {
      console.log('No blocks found. Creating Genesis Block...');
      await db.Block.createGenesisBlock();
      console.log('Genesis Block created');
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = createGenesisBlock;
