function errorHandlerMiddleware(err, req, res, next) {
  console.log(err.stack)
  res.status(500)
  res.json({
    status: 'error',
    code: err.status,
    message: err.message || "No message"
  })
}

module.exports = errorHandlerMiddleware
