const async = require('async')

function errorHandlerMiddleware(err, req, res, next) {
  console.log(err.stack)
  res.status(err.statusCode || 500)
  if (err instanceof Error) {
    res.json({
      status: 'error',
      code: err.status,
      message: [err.message || "No message"]
    })
  } else if (err instanceof Array) {
    var messages = []
    async.each(err, function(e, cb) {
      messages.push(e.msg || e.message)
      cb()
    }, function (cb) {
      res.json({
        status: 'error',
        code: 400,
        message: messages
      })
    })
  }
}

module.exports = errorHandlerMiddleware
