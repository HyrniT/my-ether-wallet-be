const SHA256 = require('crypto-js/sha256');
const { Transaction } = require('./transaction.model');

module.exports = (sequelize, Sequelize) => {
  const { DataTypes } = Sequelize;

  const Block = sequelize.define(
    'block',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      hash: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        unique: true,
      },
      previousHash: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        unique: true,
      },
      pendingTransactions: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      difficulty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3,
      },
      nonce: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      miningReward: {
        type: DataTypes.REAL,
        allowNull: false,
        defaultValue: 0.5,
      },
      status: {
        type: DataTypes.ENUM('Finalized', 'Unfinalized'),
        defaultValue: 'Unfinalized',
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

  Block.createGenesisBlock = async function () {
    const block = await this.build({
      previousHash: '0',
      nonce: 0,
      status: 'Finalized',
      timestamp: new Date(),
    });
    block.hash = block.calculateHash(block.pendingTransactions);
    await block.save();
    return block;
  };

  Block.prototype.calculateHash = function (pendingTxs, nonce) {
    return SHA256(
      this.previousHash + this.timestamp + JSON.stringify(pendingTxs) + nonce,
    ).toString();
  };

  Block.prototype.hasValidTransactions = function (pendingTxs) {
    for (const tx of pendingTxs) {
      if (!tx.isValid()) {
        return false;
      }
    }
    return true;
  };

  // Don't use it because Postgres support JSON type
  Block.prototype.addTransaction = async function (transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error('Transaction must include from and to address');
    }

    if (!transaction.isValid()) {
      throw new Error('Cannot add invalid transaction to block');
    }

    if (transaction.amount <= 0) {
      throw new Error('Transaction amount should be higher than 0');
    }

    // if (this.pendingTransactions.length >= 10) {
    //   throw new Error('Block is full');
    // }

    this.pendingTransactions.push(transaction);
    await this.save();
  };

  return Block;
};
