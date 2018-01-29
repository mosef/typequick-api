require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const { PORT, DATABASE_URL } = require('./config');
const { router: userRouter } = require('./routes/users.router');
const { router: lessonRouter } = require('./routes/lessons.router');
const { router: sessionsRouter } = require('./routes/sessions.router');

const app = express();

mongoose.Promise = global.Promise;

//logging
app.use(morgan('common'));

//CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

//parser
app.use(bodyParser.json());

//routes
app.use('/api/users/', userRouter);
app.use('/api/lessons/', lessonRouter);
app.use('/api/sessions/', sessionsRouter);

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

let server;

function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, { useMongoClient: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(PORT, () => {
          console.log(`Your app is listening on port ${PORT}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };