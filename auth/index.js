'use strict';
const {router} = require('../routes/auth.router');
const {localStrategy, jwtStrategy} = require('../auth/strategies');

module.exports = {router, localStrategy, jwtStrategy};
