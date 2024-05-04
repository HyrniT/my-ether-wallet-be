require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { PORT, CLIENT_PORT } = require('./configs/app.config');
const routes = require('./routes');
const db = require('./models');
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// app.use((error, req, res, next) => {
//   console.log(error);
//   const status = error.statusCode || 500;
//   const message = error.message;
//   res.status(status).json({ message: message });
// });

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('Database connected');
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
