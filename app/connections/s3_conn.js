
// NOTE(Cheng):
// Currently, s3 connection is not used anywhere in the project.
// This tool is just for enabling testing s3 related functionalities.
// Reference:
// https://github.com/aacerox/node-rest-client

const config = require('../config/s3')
const RestClient = require('node-rest-client').Client
const s3Conn = new RestClient()

exports.conn = s3Conn
