const express = require("express")
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  changePassword,
  loginAdmin,
} = require("../controllers/auth")
const { protect, authorize } = require("../middleware/auth")
const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/login-admin").post(loginAdmin)
router.route("/forgotPassword").post(forgotPassword)
router.route("/resetPassword/:resetToken").post(resetPassword)
router.route("/me").get(protect, getMe).put(protect, updateProfile)
router.route("/password").put(protect, changePassword)

module.exports = router
