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
    // block.addTransaction(rewardTx);
    block.pendingTransactions = pendingTxs;
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
        receiver.balance += tx.amount;
        await receiver.save();
      } else {
        sender.balance -= tx.amount + fee;
        receiver.balance += tx.amount - fee;

        await sender.save();
        await receiver.save();
      }
      await tx.save();
    }

    // Update wallet balance
    const newWallet = await Wallet.findOne({ where: { address } });

    return newWallet;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = mineBlock;
