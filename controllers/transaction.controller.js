const { Transaction } = require('../models');
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
