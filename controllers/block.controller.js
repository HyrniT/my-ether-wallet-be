const { Block } = require('../models');
const { successResponse, errorResponse } = require('../utils/formatResponse');
const mineBlock = require('../utils/mineBlock');

// [GET] /: get all blocks
exports.getBlocks = async (req, res) => {
  try {
    const blocks = await Block.findAll({ order: [['timestamp', 'DESC']] });
    res.sendResponse(successResponse(blocks));
  } catch (error) {
    console.error(error.message);
    res.sendResponse(errorResponse(error.message));
  }
};

// [GET] /:id get block by id
exports.getBlock = async (req, res) => {
  try {
    const block = await Block.findByPk(req.params.id);
    res.sendResponse(successResponse(block));
  } catch (error) {
    console.error(error.message);
    res.sendResponse(errorResponse(error.message));
  }
};

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

// [POST] /mineBlock: mine block
exports.mineBlock = async (req, res) => {
  try {
    // const block = await latestBlock.mineBlock(req.params.address);
    const address = req.body.address;
    const privateKey = req.body.privateKey;

    if (!address || !privateKey) {
      throw new Error('Address and private key are required');
    }

    const wallet = await mineBlock(address, privateKey);

    res.sendResponse(successResponse(wallet));
  } catch (error) {
    console.error(error);
    res.sendResponse(errorResponse(error.message));
  }
};
