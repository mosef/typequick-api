const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const jwtDecode = require('jwt-decode');

const { app, runServer, closeServer } = require('../server');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');
const { createNewUser, seedDb, teardownDb } = require('./test-functions');

describe('Lessons Router', () => {
  const testuser = createNewUser();
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

    it('Should return lessons from the db', () => {
      return chai
        .request(app)
        .post('/api/users/register')
        .send(testuser)
        .then();
      const token = jwt.sign({ userId: testUser._id }, JWT_SECRET, { expiresIn: 10000 });
      return chai
        .request(app)
        .post('/api/users/login')
        .send({
          email: testuser.email,
          password: testuser.password,
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          const token = res.body.authToken;
          expect(token).to.be.a('string');
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ['HS256'],
          });
        });
      return chai
        .request(app)
        .post('/api/lessons/title')
        .then((token) => {
          const decoded = jwt_decode(token);
        })
        .send({
          userId: testUser._id,
          lessonTitle: 'Learn Emmet',
        })
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
        });
    });
  });
});
