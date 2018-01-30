const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect
const jwt = require('jsonwebtoken');
const faker = require('faker');

const { app, runServer, closeServer } = require('../server');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');
const { createNewUser, seedDb, teardownDb } = require('./test-functions')

describe('Returning data from Database', function() {
  let testuser = createNewUser();
  before(function () {
    return runServer(TEST_DATABASE_URL);
  });
  after(function () {
    return closeServer();
  });

  beforeEach(function () {
    return seedDb();
  });
  afterEach(function () {
    return teardownDb();
  });

  describe('/api/sessions/start & stop', function () {

    it('Should reject unauthorized users', function() {
      return chai
      .request(app)
      .post('/api/sessions/start')
      .then(() =>
        expect.fail(null, null, 'Request should fail')
      )
      .catch(err => {
        if(err instanceof chai.AssertionError) {
          throw err;
        }
        const res = err.response;
        expect(res).to.have.status(401);
      });
    });

    it('Should create new session and store it', function() {
      let sampleUser = {
        email: faker.internet.email(),
        username: faker.name.title(),
        password: faker.internet.password()
      }
      return chai
        .request(app)
        .post('/api/users/register')
        .send(sampleUser)
        .then(res => {
          const token = jwt.sign({userId: sampleUser._id}, JWT_SECRET, { expiresIn: 10000 });
          console.log(token)
          return chai
          .request(app)
          .post('/api/users/login')
          .set('Authorization', 'Bearer', + token)
          .send({
            email: sampleUser.email,
            password: sampleUser.password
          })
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            const token = res.body;
            expect(token).to.be.an('object')
            const payload = jwt.verify(token, JWT_SECRET, {
              algorithm: ['HS256']
            })
          })
          .catch(err => {
            if(err instanceof chai.AssertionError) {
              throw err;
              console.log(err)
            }
            })
          .then(() => {
            const timestart = 75;
            const timeEnd = 200;
            return chai
            .request(app)
            .post('/api/sessions/stop')
            .set('Authorization', 'Bearer', + token)
            .send({
              startedAt: timestart,
              stoppedAt: timeEnd,
              userId: sampleUser._id
            })
            .then((res) => {
              expect(res).to.have.status(200);
              expect(res).to.be.an('object');
              expect(res).to.be.lengthOf(1);
              expect(res.body.durationInMs).to.equal(125)  
              })
            .catch(err => {
            if(err instanceof chai.AssertionError) {
              throw err;
            }
            const res= err.response;
            expect(res).to.have.status(401)
            console.log(err)
          });
        })   
      })
    })
  })
})
