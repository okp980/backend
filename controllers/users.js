//@desc - Get all Users
//@route - GET api/v1/users

const User = require("../models/User")
const ErrorResponse = require("../util/ErrorResponse")
const { getAdvancedResults } = require("../util/helper")

// @access - Private
exports.getUsers = async function (req, res, next) {
  try {
    const result = await getAdvancedResults(req, User)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

//@desc - Get Single User
//@route - GET api/v1/users/:userId
// @access - Private
exports.getUser = async function (req, res, next) {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) return next(new ErrorResponse("User not found", 404))

    res.status(200).json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}

//@desc - Create User
//@route - POST api/v1/users/:userId
// @access - Private
exports.createUser = async function (req, res, next) {
  try {
    const user = await User.create(req.body)
    res.status(201).json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}

//@desc - Update User
//@route - PUT api/v1/users/:userId
// @access - Private
exports.updateUser = async function (req, res, next) {
  try {
    let user = await User.findById(req.params.userId)
    if (!user) return next(new ErrorResponse("User not found", 404))
    user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
      runValidators: true,
    })
    res
      .status(200)
      .json({ success: true, message: "User updated successfully", data: user })
  } catch (error) {
    next(error)
  }
}

//@desc - Delete User
//@route - DELETE api/v1/users/:userId
// @access - Private
exports.deleteUser = async function (req, res, next) {
  try {
    let user = await User.findById(req.params.userId)
    if (!user) return next(new ErrorResponse("User not found", 404))
    user = await User.findByIdAndDelete(req.params.userId)
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully", data: {} })
  } catch (error) {
    next(error)
  }
}
