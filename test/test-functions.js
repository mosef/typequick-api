const faker = require('faker');
const mongoose = require('mongoose')
const User = require('../models/user');

mongoose.Promise = global.Promise;

function teardownDb() {
  return new Promise((resolve, reject) => {
    console.warn("Deleting Database");
    mongoose.connection
      .dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

function createNewUser() {
  let newUser = new User({
    email: faker.internet.email(),
    username: faker.name.title(),
    password: faker.internet.password(),
  });
  return newUser
};


module.exports = { createNewUser, teardownDb }