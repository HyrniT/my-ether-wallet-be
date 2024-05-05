const db = require('../services/db.service');
const { sequelize, Sequelize } = db;

db.Wallet = require('./wallet.model')(sequelize, Sequelize);
db.Block = require('./block.model')(sequelize, Sequelize);
db.Transaction = require('./transaction.model')(sequelize, Sequelize);

// Associations
// Transaction - Block
db.Block.hasMany(db.Transaction, {
  foreignKey: 'blockId',
});
db.Transaction.belongsTo(db.Block, {
  foreignKey: 'blockId',
});
// User - Transaction
db.Wallet.hasMany(db.Transaction, {
  foreignKey: 'walletId',
});
db.Transaction.belongsTo(db.Wallet, {
  foreignKey: 'walletId',
});

module.exports = db;
