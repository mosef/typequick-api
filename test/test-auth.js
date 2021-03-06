const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');

const expect = chai.expect;

const { app, runServer, closeServer } = require('../server');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');
const { teardownDb, createNewUser } = require('./test-functions');

chai.use(chaiHttp);

describe('Authentication', () => {
  const testuser = createNewUser();
  before(() => runServer(TEST_DATABASE_URL));
  after(() => closeServer());

  beforeEach(() => {
  });
  afterEach(() => teardownDb());

  describe('/api/users/login', () => {
    it('Should reject empty requests', () => chai
      .request(app)
      .post('/api/users/login')
      .then(() =>
        expect.fail(null, null, 'Request should fail'))
      .catch((err) => {
        if (err instanceof chai.AssertionError) {
          throw err;
        }
        const res = err.response;
        expect(res).to.have.status(400);
      }));

    it('Should reject invalid email addresses', () => chai
      .request(app)
      .post('/api/users/register')
      .send({ email: 'testemail', password: 'aouhid1881', username: 'testname' })
      .then(() => chai
        .request(app)
        .post('/api/users/login')
        .send({
          email: 'wrongmail',
          password: 'aouhid1881',
        }))
      .then(() =>
        expect.fail(null, null, 'Request should fail'))
      .catch((err) => {
        if (err instanceof chai.AssertionError) {
          throw err;
        }
        const res = err.response;
        expect(res).to.have.status(401);
      }));

    it('Should reject invalid passwords', () => chai
      .request(app)
      .post('/api/users/login')
      .send({ email: testuser.email, password: 'wrongPass' })
      .then(() =>
        expect.fail(null, null, 'Request should fail'))
      .catch((err) => {
        if (err instanceof chai.AssertionError) {
          throw err;
        }
        const res = err.response;
        expect(res).to.have.status(401);
      }));

    it('Should return vaild Auth Token', () => chai
      .request(app)
      .post('/api/users/register')
      .send({ email: 'testemail', password: 'aouhid1881', username: 'testname' })
      .then((res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
      })
      .catch((err) => {
        if (err instanceof chai.AssertionError) {
          throw err;
        }
        const res = err.response;
        expect(res).to.have.status(401);
      }));

    describe('api/users/refresh', () => {
      it('Should reject empty credentials', () => chai
        .request(app)
        .post('/api/users/refresh')
        .then(() =>
          expect.fail(null, null, 'Request should fail'))
        .catch((err) => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(401);
        }));

      it('Should reject invalid tokens', () => {
        const token = jwt.sign(
          {
            email: testuser.email,
            password: testuser.password,
            username: testuser.username,
          },
          'invalidSecret',
          {
            algorithm: 'HS256',
            expiresIn: '7d',
          },
        );

        return chai
          .request(app)
          .post('/api/users/refresh')
          .send({ email: 'testemail' })
          .set('Authorization', `Bearer ${token}`)
          .then(() =>
            expect.fail(null, null, 'Request should fail'))
          .catch((err) => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
            const res = err.response;
            expect(res).to.have.status(401);
          });
      });

      it('Should reject expired tokens', () => {
        const token = jwt.sign(
          {
            user: {
              email: testuser.email,
              password: testuser.password,
            },
            exp: Math.floor(Date.now() / 1000) - 10,
          },
          JWT_SECRET,
          {
            algorithm: 'HS256',
            subject: testuser.email,
          },
        );
        return chai
          .request(app)
          .post('/api/users/refresh')
          .send({ email: 'testemail' })
          .set('authorization', `Bearer ${token}`)
          .then(() =>
            expect.fail(null, null, 'Request should fail'))
          .catch((err) => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
            const res = err.response;
            expect(res).to.have.status(401);
          });
      });

      it('Should refresh auth token', () => chai
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
          .post('/api/users/refresh')
          .send({ email: 'testemail' })
          .set('authorization', tokenTest.responseToken))
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          const token = res.body.token;
          expect(token).to.be.a('string');
        })
        .catch((err) => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(401);
        }));
    });
  });
});
