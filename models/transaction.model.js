const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const { getAddress } = require('../utils/keyGenerator');

module.exports = (sequelize, Sequelize) => {
  const { DataTypes } = Sequelize;
  const Transaction = sequelize.define(
    'transaction',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      hash: {
        type: DataTypes.CHAR(66),
        allowNull: false,
        unique: true,
      },
      fromAddress: {
        type: DataTypes.CHAR(42),
      },
      toAddress: {
        type: DataTypes.CHAR(42),
        allowNull: false,
      },
      amount: {
        type: DataTypes.REAL,
        allowNull: false,
      },
      signature: {
        type: DataTypes.STRING,
        unique: true,
      },
      status: {
        type: DataTypes.ENUM('Pending', 'Success', 'Failed'),
        defaultValue: 'Pending',
      },
      timestamp: {
        type: DataTypes.DATE, // TIMESTAMP WITH TIME ZONE for postgres
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
      freezeTableName: false,
    },
  );

  Transaction.prototype.calculateHash = function () {
    return SHA256(
      this.fromAddress + this.toAddress + this.amount + this.timestamp,
    ).toString();
  };

  Transaction.prototype.signTransaction = function (privateKey) {
    const signingKey = ec.keyFromPrivate(privateKey);

    if (getAddress(signingKey.getPublic('hex')) !== this.fromAddress) {
      throw new Error('You cannot sign transactions for other wallets!');
    }

    const hashTransaction = this.calculateHash();
    const sig = signingKey.sign(hashTransaction, 'base64');

    this.signature = sig.toDER('hex');
  };

  Transaction.prototype.isValid = function () {
    if (this.fromAddress === null) return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction');
    }

    const key = ec.keyFromPublic(this.fromAddress, 'hex');
    return key.verify(this.calculateHash(), this.signature);
  };

  return Transaction;
};
