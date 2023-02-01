// TODO: require all necessary dependencies to start and run a express server and mongo DB
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { DB_URI } = process.env;

// TODO: require all Routes
const auth = require('./routes/auth.js');

// TODO: connect routes

// TODO: have app use express on PORT 3000
const PORT = 3000;
const app = express();

// TODO: set up express server so that the app can parse cookies and JSON responses
app.use(cookieParser());
app.use(express.json());

// TODO: set up mongoose connection
mongoose.set('strictQuery', false);

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log('Connected to DB ✅');
    app.listen(PORT, console.log(`Listening at http://localhost:${PORT}/ ✅`));
  })
  .catch(console.error);

// TODO: set up express routes
app.use('/api', auth);

// TODO: get main page when domain reaches '/'
app.get('/', (_, res) => {
  res.status(200).sendFile(path.resolve(__dirname, '../client/index.html'));
});

// TODO: set up catch all route error handling
app.use((_, res) => {
  res.status(404).sendFile(path.resolve(__dirname, '../client/404.html'));
});

// TODO: set up Express error handling
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});
