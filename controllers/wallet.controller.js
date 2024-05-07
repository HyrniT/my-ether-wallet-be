const { Wallet, Transaction } = require('../models');
const { successResponse, errorResponse } = require('../utils/formatResponse');
const { publicKey, privateKey, address } = require('../utils/keyGenerator');
const hash = require('../utils/hash');
const signTransaction = require('../utils/signTransaction');

// [GET] /wallet/create: generate a new wallet
exports.createWallet = async (req, res) => {
  try {
    await Wallet.create({
      publicKey: publicKey,
      address: address,
    });
    res.sendResponse(successResponse({ privateKey: privateKey }, 201));
  } catch (error) {
    console.error(error.message);
    res.sendResponse(errorResponse());
  }
};

// [GET] /wallet/:publicKey: get wallet by public key
exports.getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({
      where: { publicKey: req.params.publicKey },
    });
    if (wallet) {
      res.sendResponse(successResponse(wallet));
    } else {
      res.sendResponse(errorResponse('Wallet not found', 401));
    }
  } catch (error) {
    console.error(error.message);
    res.sendResponse(errorResponse());
  }
};

// [POST] /wallet/send: send transaction
exports.sendTransaction = async (req, res) => {
  try {
    const sender = await Wallet.findOne({
      where: { address: req.body.sender },
    });
    const receiver = await Wallet.findOne({
      where: { address: req.body.receiver },
    });
    if (sender && receiver) {
      if (sender.balance >= req.body.amount) {
        const privateKey = req.body.privateKey;
        const fromAddress = sender.address;
        const toAddress = receiver.address;
        const amount = req.body.amount;
        const transaction = await Transaction.create({
          hash: hash(fromAddress, toAddress, amount, new Date().getTime()),
          fromAddress: fromAddress,
          toAddress: toAddress,
          amount: amount,
          timestamp: new Date().getTime(),
          walletId: sender.id,
        });
        const signature = signTransaction(transaction, privateKey);
        await transaction.update({ signature: signature });
        await sender.update({ balance: sender.balance - req.body.amount });
        await receiver.update({ balance: receiver.balance + req.body.amount });
        res.sendResponse(successResponse(transaction, 201));
      } else {
        res.sendResponse(errorResponse('Insufficient balance', 401));
      }
    } else {
      res.sendResponse(errorResponse('Wallet not found', 401));
    }
  } catch (error) {
    console.error(error);
    res.sendResponse(errorResponse());
  }
};

// [PATCH] /wallet/balance/:publicKey: update wallet balance
exports.updateBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({
      where: { publicKey: req.params.publicKey },
    });
    if (wallet) {
      await wallet.update({ balance: req.body.balance });
      res.sendResponse(successResponse(wallet));
    } else {
      res.sendResponse(errorResponse('Wallet not found', 401));
    }
  } catch (error) {
    console.error(error.message);
    res.sendResponse(errorResponse());
  }
};
