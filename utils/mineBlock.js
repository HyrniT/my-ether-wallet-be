const { Block, Transaction, Wallet } = require('../models');

const fee = 0.000256;

async function mineBlock(address, privateKey) {
  try {
    const pendingTxs = await Transaction.findAll({
      where: { status: 'Pending' },
    });

    if (pendingTxs.length <= 1) {
      throw new Error('Block must contain at least 2 transactions');
    }

    const latestBlock = await Block.findOne({
      order: [['timestamp', 'DESC']],
    });

    const wallet = await Wallet.findOne({ where: { address } });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const block = Block.build({
      previousHash: latestBlock.hash,
      timestamp: new Date(),
    });

    const rewardTx = Transaction.build({
      toAddress: address,
      amount: block.miningReward,
      walletId: wallet.id,
    });

    rewardTx.hash = '0x' + rewardTx.calculateHash();
    rewardTx.signature = rewardTx.signTransaction(privateKey);
    await rewardTx.save();

    let hash = '';
    let nonce = 0;
    while (
      hash.substring(0, latestBlock.difficulty) !==
      '0'.repeat(latestBlock.difficulty)
    ) {
      nonce++;
      hash = block.calculateHash(pendingTxs, nonce);
    }

    block.hash = hash;
    block.nonce = nonce;
    block.status = 'Finalized';
    await block.save();

    for (const tx of pendingTxs) {
      tx.status = 'Success';
      tx.blockId = block.id;

      const sender = await Wallet.findOne({
        where: { address: tx.fromAddress },
      });
      const receiver = await Wallet.findOne({
        where: { address: tx.toAddress },
      });

      if (!receiver) {
        throw new Error('Receiver wallet not found');
      }

      if (!sender) {
        console.log('Reward transaction', tx.amount);
        receiver.balance += tx.amount;
        await receiver.save();
      } else {
        sender.balance -= tx.amount + fee;
        receiver.balance += tx.amount - fee;

        await sender.save();
        await receiver.save();
      }

      console.log('Transaction', tx.hash, 'is mined');
      await tx.save();
    }

    return wallet;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = mineBlock;
