const User = require("../models/User")
const ErrorResponse = require("../util/ErrorResponse")
const sendEmail = require("../util/nodemailer")
const crypto = require("crypto")
const bcrypt = require("bcrypt")
const Cart = require("../models/Cart")

//@desc - register users
//@route - POST api/v1/auth/register
// @access - Public
exports.register = async function (req, res, next) {
  try {
    const user = await User.create(req.body)
    const token = user.generateToken()
    res.status(201).json({ success: true, token })
  } catch (error) {
    next(error)
  }
}

//@desc - login users
//@route - POST api/v1/auth/login
// @access - Public
exports.login = async function (req, res, next) {
  const { cartId } = req.cookies
  try {
    const user = await User.findCredentials(req.body.email, req.body.password)
    const token = user.generateToken()
    // register a cart to a user on login
    if (cartId) {
      const cart = await Cart.findById(cartId)
      if (!cart) {
        // clear cart from cookkie if not found
        res.clearCookie("cartId")
      }
      cart.user = user._id
      await cart.save()
    }
    res.status(200).json({ success: true, message: "Login successful", token })
  } catch (error) {
    next(error)
  }
}

//@desc - login Admin
//@route - POST api/v1/auth/login-admin
// @access - Public
exports.loginAdmin = async function (req, res, next) {
  try {
    const user = await User.findAdminCredentials(
      req.body.email,
      req.body.password
    )
    const token = user.generateToken()
    res.status(200).json({ success: true, message: "Login successful", token })
  } catch (error) {
    next(error)
  }
}

//@desc - get login user
//@route - GET api/v1/auth/me
// @access - Private
exports.getMe = async function (req, res, next) {
  try {
    const user = await User.findById(req.user.id)
    res.status(200).json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

//@desc - forgot password
//@route - POST api/v1/auth/forgotPassword
// @access - Public
exports.forgotPassword = async function (req, res, next) {
  try {
    const email = req.body.email
    if (!email) return next(new ErrorResponse("Email is missing", 400))
    const user = await User.findOne({ email: req.body.email })
    if (!user) return next(new ErrorResponse("User not found", 404))
    const token = user.generateResetToken()
    await user.save({ validateBeforeSave: false })
    const options = {
      email: req.body.email,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${req.protocol}://${req.headers.host}/api/v1/auth/resetPassword/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      html: null,
    }
    try {
      await sendEmail(options)
      res.status(200).json({
        success: true,
        message: `A link to reset your password has been sent to ${req.body.email}.`,
      })
    } catch (error) {
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined
      await user.save({ validateBeforeSave: false })
      next(new ErrorResponse("Email could not be sent", 500))
    }
  } catch (error) {
    next(error)
  }
}

//@desc - reset password
//@route - POST api/v1/auth/resetPassword/:resetToken
// @access - Public

exports.resetPassword = async function (req, res, next) {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex")

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    })
    if (!user) return next(new ErrorResponse("Invalid Reset Token", 400))
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()
    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" })
  } catch (error) {
    next(error)
  }
}

//@desc - update Password
//@route - PUT api/v1/auth/password
// @access - Public

exports.changePassword = async function (req, res, next) {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body
    if (confirmPassword !== newPassword)
      return next(
        new ErrorResponse("newPassword must match confirmPassword", 400)
      )
    const user = await User.findById(req.user.id).select("+password")

    if (!user) return next(new ErrorResponse("Not Found", 404))
    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch)
      return next(
        new ErrorResponse("Incorrect password, enter the correct password", 400)
      )
    user.password = newPassword

    await user.save()
    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" })
  } catch (error) {
    next(error)
  }
}

//@desc - update profile
//@route - PUT api/v1/auth/me
// @access - Public

exports.updateProfile = async function (req, res, next) {
  try {
    const { email, name } = req.body
    const user = await User.findById(req.user.id)

    if (!user) return next(new ErrorResponse("Not Found", 404))
    // user.email = email
    // user.name = name
    // await user.save()
    await User.findByIdAndUpdate(
      req.user.id,
      { email, name },
      {
        new: true,
        runValidators: true,
      }
    )
    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" })
  } catch (error) {
    next(error)
  }
}
