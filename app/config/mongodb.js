const util = require('util');

// ----------------------------
// MODIFY THE FOLLOWING FIELDS BEFORE USING THIS SERVICE
const MONGO_USERNAME = 'user'
const MONGO_PASSWORD = 'password'
const MONGO_HOST = '127.0.0.1'
const MONGO_PORT = '27017'
const MONGO_DB_NAME = 'db'
// -----------------------------

module.exports = {
  mongoDB: util.format('mongodb://%s:%s@%s:%s/%s', MONGO_USERNAME, MONGO_PASSWORD,
                            MONGO_HOST, MONGO_PORT, MONGO_DB_NAME),
  testDB: util.format('mongodb://%s:%s@%s:%s/%s', MONGO_USERNAME, MONGO_PASSWORD,
                            MONGO_HOST, MONGO_PORT, 'test'),
}

