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

module.exports = db;
