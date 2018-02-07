const faker = require('faker');
const mongoose = require('mongoose')
const User = require('../models/user');
const Lesson = require('../models/lesson');

mongoose.Promise = global.Promise;

function seedDb() {
  console.info("seeding database");
  const lesson = {
    lessonTitle: "Learn Emmet",
      chapter: {
        difficulty: ["Basics"],
        page: {
          title: "Classes, Id's and lists",
          content:
            " To make a div with a class simply type a period before the div's name. Exmaple: '.text-box' <div class='text-box'></div>"
        }
      }
  }
  return lesson;
}

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


module.exports = { createNewUser, teardownDb, seedDb }