const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const jwtDecode = require('jwt-decode');

const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const { seedDb, teardownDb } = require('./test-functions');

describe('Returning data from Database', () => {
  before(() => runServer(TEST_DATABASE_URL));
  after(() => closeServer());

  beforeEach(() => seedDb());
  afterEach(() => teardownDb());

  describe('Sessions Router', () => {
    it('Should reject requests with empty auth headers', () => chai
      .request(app)
      .post('/api/sessions/')
      .then(() =>
        expect.fail(null, null, 'Request should fail'))
      .catch((err) => {
        if (err instanceof chai.AssertionError) {
          throw err;
        }
        const res = err.response;
        expect(res).to.have.status(400);
      }));

    it('Should create new session and store it', () => chai
      .request(app)
      .post('/api/users/register')
      .send({ email: 'testemail', password: 'aouhid1881', username: 'testname' })
      .then((res) => {
        const responseToken = res.body.token;
        const token = responseToken.replace('Bearer', '');
        const decoded = jwtDecode(token);
        const tokenTest = {
          responseToken,
          token,
          decoded,
        };
        return tokenTest;
      })
      .then(tokenTest => chai
        .request(app)
        .post('/api/sessions/')
        .set('Authorization', tokenTest.responseToken)
        .send({ userId: tokenTest.decoded._id, startedAt: 1517981331125, stoppedAt: 1517982584178 })
        .then((res) => {
          expect(res).to.have.status(201);
        })));
  });
});
