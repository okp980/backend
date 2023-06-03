const ErrorResponse = require("../util/ErrorResponse")

function errorHandler(err, req, res, next) {
  let error = err
  console.log(err)
  if (err.name === "CastError") {
    error = new ErrorResponse(`Resource not found `, 404)
  }

  // duplicate key
  if (err.code === 11000) {
    error = new ErrorResponse("Resource already exist", 403)
  }

  // validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)?.map(
      (item) => item.properties?.message
    )
    error = new ErrorResponse(message, 400)
  }
  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server Error" })
}

module.exports = errorHandler
