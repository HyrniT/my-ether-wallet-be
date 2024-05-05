const { Wallet } = require('../models');
const { successResponse, errorResponse } = require('../utils/formatResponse');
const { publicKey, privateKey, address } = require('../utils/keyGenerator');

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
