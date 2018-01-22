exports.DATABASE_URL =
    process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    'mongodb://localhost/typequick-api';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||'mongodb://localhost/test-typequick';
exports.PORT = process.env.PORT || 27017;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
