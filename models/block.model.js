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
      nonce: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('Finalized', 'Unfinalized'),
        defaultValue: 'Finalized',
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

  return Block;
};
