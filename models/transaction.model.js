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
        type: DataTypes.CHAR(64),
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
        // allowNull: false,
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

  return Transaction;
};
