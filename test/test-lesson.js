const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const jwtDecode = require('jwt-decode');

const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const { seedDb, teardownDb } = require('./test-functions');

describe('Lessons Router', () => {
  before(() => runServer(TEST_DATABASE_URL));
  after(() => closeServer());

  beforeEach(() => seedDb());
  afterEach(() => teardownDb());

  describe('/api/lessons/', () => {
    it('Should reject requests with empty auth headers', () => chai
      .request(app)
      .post('/api/lessons/title')
      .then(() =>
        expect.fail(null, null, 'Request should fail'))
      .catch((err) => {
        if (err instanceof chai.AssertionError) {
          throw err;
        }
        const res = err.response;
        expect(res).to.have.status(400);
      }));

    it('Should return lessons from the db', () => chai
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
        .post('/api/lessons/title')
        .send({
          userId: tokenTest.decoded._id,
          lessonTitle: 'Learn Emmet',
        }))
      .then((res) => {
        const data = res.body;
        expect(data).to.have.status(200);
        expect(data).to.be.an('object');
        expect(data).to.be.lengthOf(1);
      })
      .catch((err) => {
        if (err instanceof chai.AssertionError) {
          throw err;
        }
        const res = err.response;
        expect(res).to.have.status(400);
      }));
  });
});
