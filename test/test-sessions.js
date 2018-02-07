const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
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

  describe('Sessions Router', function () {

    it('Should reject requests with empty auth headers', function() {
      return chai
      .request(app)
      .post('/api/sessions/')
      .then(() =>
        expect.fail(null, null, 'Request should fail')
      )
      .catch(err => {
        if(err instanceof chai.AssertionError) {
          throw err;
        }
        const res = err.response;
        expect(res).to.have.status(400);
      });
    });

    it('Should create new session and store it', function() {
      return chai
      .request(app)
      .post('/api/users/register')
      .send({email: "testemail", password: "aouhid1881", username: "testname"})
      .then(res => {
        let responseToken = res.body.token;
        let token = responseToken.replace('Bearer', '');
        let decoded = jwtDecode(token);
        const tokenTest = {
          responseToken,
          token,
          decoded
        }
        return tokenTest
      })
      .then((tokenTest) => {
        return chai
        .request(app)
        .post('/api/sessions/')
        .set('Authorization', tokenTest.responseToken)
        .send({ userId: tokenTest.decoded._id, startedAt: 1517981331125, stoppedAt: 1517982584178 })
        .then((res) => {
          expect(res).to.have.status(201)
        })
      })
    })
  })
})
