module.exports = (sequelize, Sequelize) => {
  const { DataTypes } = Sequelize;

  const User = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      publicKey: {
        type: DataTypes.CHAR(130),
        allowNull: false,
        unique: true,
      },
      addressWallet: {
        type: DataTypes.CHAR(42),
        allowNull: false,
        unique: true,
      },
      balance: {
        type: DataTypes.REAL, // Postgres only
        defaultValue: 0,
      },
      createdAt: {
        type: DataTypes.DATE, // TIMESTAMP WITH TIME ZONE for postgres
        defaultValue: Sequelize.NOW,
      },
    },
    {
      timestamps: false,
      freezeTableName: false,
    },
  );

  return User;
};
