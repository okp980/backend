const ErrorResponse = require("../util/ErrorResponse")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const passport = require("passport")

exports.protect = async function (req, res, next) {
  try {
    const token = req.headers?.authorization?.split(" ")[1]
    if (!token) {
      return next(new ErrorResponse("User not authenticated", 401))
    }
    const decode = jwt.verify(token, process.env.SECRET_JWT)

    const user = await User.findById(decode.id)
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
  // passport.authenticate("jwt", { session: false })
}

exports.authorize = function (...roles) {
  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse("User not authorized", 403))
    }
    next()
  }
}
