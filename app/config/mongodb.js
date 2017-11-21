const util = require('util');

const MONGO_USERNAME = 'test';
const MONGO_PASSWORD = 'test_pwd';
const MONGO_HOST = '127.0.0.1';
const MONGO_PORT = '27017';
const MONGO_DB_NAME = 'spotlite';

module.exports = {
  mongo_db: util.format('mongodb://%s:%s@%s:%s/%s', MONGO_USERNAME, MONGO_PASSWORD,
                            MONGO_HOST, MONGO_PORT, MONGO_DB_NAME),
}

//module.exports = {
//  mongo_db: "mongodb://test:test_pwd@127.0.0.1:27017/spotlite"
//}
