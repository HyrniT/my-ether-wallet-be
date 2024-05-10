module.exports = (sequelize, Sequelize) => {
  const { DataTypes } = Sequelize;

  const Blockchain = sequelize.define(
    'blockchain',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      difficulty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5,
      },
      pendingTransactions: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      miningReward: {
        type: DataTypes.REAL,
        allowNull: false,
        defaultValue: 100,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    },
  );

  Blockchain.prototype.createGenesisBlock = async function () {
    const block = await sequelize.models.Block.build({
      previousHash: '0',
      nonce: 0,
      status: 'Finalized',
      timestamp: new Date(),
    });
    await block.save();
    return block;
  };

  Blockchain.prototype.minePendingTransactions = async function (minerAddress) {
    const rewardTx = await sequelize.models.Transaction.build({
      fromAddress: '0',
      toAddress: minerAddress,
      amount: this.miningReward,
      timestamp: new Date(),
    });
    rewardTx.hash = '0x' + rewardTx.calculateHash();
    this.pendingTransactions.push(rewardTx);
    const block = await this.createBlock(this.pendingTransactions);
    await block.save();
    this.pendingTransactions = [];
    return block;
  };

  Blockchain.prototype.createBlock = async function (transactions) {
    const block = await sequelize.models.Block.build({
      previousHash: '0',
      nonce: 0,
      status: 'Unfinalized',
      timestamp: new Date(),
    });
    block.hash = '0x' + block.calculateHash(transactions);
    return block;
  };

  return Blockchain;
};
