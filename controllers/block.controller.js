const e = require('express');
const { Wallet, Transaction, Block } = require('../models');
const { successResponse, errorResponse } = require('../utils/formatResponse');

// [GET] /latest: get latest block
exports.getLatestBlock = async (req, res) => {
  try {
    const block = await Block.findOne({
      order: [['timestamp', 'DESC']],
    });
    res.sendResponse(successResponse(block));
  } catch (error) {
    console.error(error.message);
    res.sendResponse(errorResponse(error.message));
  }
};

const mineBlock = async (address, privateKey) => {
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

    const block = await Block.build({
      previousHash: latestBlock.hash,
      timestamp: new Date(),
    });

    // const isValid = await block.hasValidTransactions(pendingTxs);
    // if (!isValid) {
    //   throw new Error('Block contains invalid transactions');
    // }

    const rewardTx = await Transaction.build({
      toAddress: address,
      amount: block.miningReward,
      walletId: wallet.id,
    });
    rewardTx.hash = rewardTx.calculateHash();
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
    block.pendingTransactions = pendingTxs;
    block.status = 'Finalized';
    await block.save();

    pendingTxs.forEach(async tx => {
      tx.status = 'Success';
      await tx.save();
    });

    pendingTxs.forEach(async tx => {
      tx.blockId = block.id;
      await tx.save();
    });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

// [POST] /mineBlock: mine block
exports.mineBlock = async (req, res) => {
  try {
    // const block = await latestBlock.mineBlock(req.params.address);
    const address = req.body.address;
    const privateKey = req.body.privateKey;

    if (!address || !privateKey) {
      throw new Error('Address and private key are required');
    }

    const block = await mineBlock(address, privateKey);

    res.sendResponse(successResponse(block));
  } catch (error) {
    console.error(error);
    res.sendResponse(errorResponse(error.message));
  }
};
