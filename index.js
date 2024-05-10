require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { PORT, CLIENT_PORT } = require('./configs/app.config');
const routes = require('./routes');
const db = require('./models');

const responseHandler = require('./middlewares/responseHandler');
const { errorResponse, successResponse } = require('./utils/formatResponse');

const createGenesisBlock = require('./utils/createGenesisBlock');

const app = express();

app.use(
  cors({
    origin: `http://localhost:${CLIENT_PORT}`,
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  );
  next();
});

app.use(responseHandler);

app.use('/api', routes);

app.get('/', (req, res) => {
  const responseData = successResponse({ message: 'Hello World!' }); // for testing
  res.sendResponse(responseData);
});

app.use((req, res, next) => {
  const responseData = errorResponse('Not found', 404);
  res.sendResponse(responseData);
});

db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('Database connected');

    createGenesisBlock();

    app
      .listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
      })
      .on('error', err => {
        console.log(err);
        process.exit();
      });
  })
  .catch(err => console.log(err));
