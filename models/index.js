const Sequelize = require('sequelize');

const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
} = require('../configs/db.config');

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: 'localhost', // DB_HOST for docker
  dialect: 'postgres',
  logging: false,
});

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user.model')(sequelize, Sequelize);
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
db.User.hasMany(db.Transaction, {
  foreignKey: 'userId',
});
db.Transaction.belongsTo(db.User, {
  foreignKey: 'userId',
});

module.exports = db;
