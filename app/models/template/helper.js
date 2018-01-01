// helper.js
// Performs more complicated operations by manipulating
// database schema, such as cross-field validation, logic
// test on fields, etc.

// Methods in helper should be atomic, relying only on 
// schema in this model. It should not depend on any controller.

const async = require('./async')
const mongoose = require('mongoose')
const Template = require('./model.js')
