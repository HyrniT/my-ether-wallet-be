const e = require('express');
const { Wallet, Transaction } = require('../models');
const { successResponse, errorResponse } = require('../utils/formatResponse');

// [GET] /transaction: get all transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      order: [['timestamp', 'DESC']],
    });
    res.sendResponse(successResponse(transactions));
  } catch (error) {
    console.error(error.message);
    res.sendResponse(errorResponse());
  }
};

// [GET] /transaction/:hash: get transaction by hash
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: { hash: req.params.hash },
    });
    if (transaction) {
      res.sendResponse(successResponse(transaction));
    } else {
      res.sendResponse(errorResponse('Transaction not found', 401));
    }
  } catch (error) {
    console.error(error.message);
    res.sendResponse(errorResponse());
  }
};

// [GET] /transaction/pending: get all pending transactions
exports.getPendingTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { status: 'Pending' },
      order: [['timestamp', 'DESC']],
    });
    res.sendResponse(successResponse(transactions));
  } catch (error) {
    console.error(error.message);
    res.sendResponse(errorResponse(error.message));
  }
};

// [POST] /transaction/send: send transaction
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
        const transaction = await Transaction.build({
          fromAddress: fromAddress,
          toAddress: toAddress,
          amount: amount,
          timestamp: new Date(),
        });
        transaction.walletId = sender.id;
        transaction.hash = '0x' + transaction.calculateHash();
        transaction.signTransaction(privateKey);
        transaction.save().then(async () => {
          // try {
          //   await sender.update({ balance: sender.balance - req.body.amount });
          //   await receiver.update({
          //     balance: receiver.balance + req.body.amount,
          //   });
          // } catch (error) {
          //   console.error(error);
          // }
        });
        res.sendResponse(successResponse(transaction, 201));
      } else {
        res.sendResponse(errorResponse('Insufficient balance', 406));
      }
    } else {
      res.sendResponse(errorResponse('Wallet not found', 401));
    }
  } catch (error) {
    console.error(error);
    res.sendResponse(errorResponse(error.message));
  }
};

// [PATCH] /transaction/:hash: update status transaction by hash
// exports.updateTransaction = async (req, res) => {
//   try {
//     const transaction = await Transaction.findOne({
//       where: { hash: req.params.hash },
//     });
//     if (transaction) {
//       await transaction.update({ status: req.body.status });
//       res.sendResponse(successResponse(transaction));
//     } else {
//       res.sendResponse(errorResponse('Transaction not found', 401));
//     }
//   } catch (error) {
//     console.error(error.message);
//     res.sendResponse(errorResponse());
//   }
// };
