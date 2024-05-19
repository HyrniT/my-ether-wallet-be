const { Wallet, Transaction } = require('../models');
const { successResponse, errorResponse } = require('../utils/formatResponse');
const {
  generateKeyPair,
  getPublicKey,
  getPrivateKey,
  getAddress,
} = require('../utils/keyGenerator');

// [GET] /wallet/create: generate a new wallet
exports.createWallet = async (req, res) => {
  try {
    const keyPair = generateKeyPair();
    const publicKey = getPublicKey(keyPair);
    const privateKey = getPrivateKey(keyPair);
    const address = getAddress(publicKey);

    await Wallet.create({
      publicKey: publicKey,
      address: address,
    });
    res.sendResponse(successResponse({ privateKey: privateKey }, 201));
  } catch (error) {
    console.error(error.message);
    res.sendResponse(errorResponse(error.message));
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
    res.sendResponse(errorResponse(error.message));
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
    res.sendResponse(errorResponse(error.message));
  }
};
