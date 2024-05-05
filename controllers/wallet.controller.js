const { Wallet } = require('../models');
const { successResponse, errorResponse } = require('../utils/formatResponse');

// [GET] /wallet/create: generate a new wallet
exports.createWallet = async (req, res) => {
  try {
    res.sendResponse(successResponse({ message: 'Created wallet' }, 201));
  } catch (error) {
    console.error(error.message);
    res.sendResponse(errorResponse());
  }
};

// [GET] /wallet/:id: get wallet by id
exports.getWallet = async (req, res) => {
  try {
    // const wallet = await Wallet.findByPk(req.params.id);
    // res.json(wallet);
  } catch (error) {
    console.error(error.message);
    res.sendResponse(errorResponse());
  }
};
