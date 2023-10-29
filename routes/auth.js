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
const passport = require("passport")
const jwt = require("jsonwebtoken")

router.route("/register").post(register)
// router.route("/login").post(login)
router.route("/login").post(
  passport.authenticate("local", {
    session: false,
  }),
  (req, res) => {
    console.log("req.user: " + req.user)
    jwt.sign(
      { id: req.user },
      process.env.SECRET_JWT,
      {
        expiresIn: process.env.JWT_EXPIRATION,
      },
      (err, token) => {
        if (err) {
          return res.json({
            token: null,
          })
        }
        res.json({
          success: true,
          message: "Login successful",
          token,
        })
      }
    )
  }
)
router.route("/login-admin").post(loginAdmin)
router.route("/forgotPassword").post(forgotPassword)
router.route("/resetPassword/:resetToken").post(resetPassword)
router.route("/me").get(protect, getMe).put(protect, updateProfile)
router.route("/password").put(protect, changePassword)
router.route("/failure").get((req, res) => res.send("Failed to login"))
router.route("/success").get((req, res) => res.send("Google login successful"))
router
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }))
router.route("/google/callback").get(
  passport.authenticate("google", {
    session: false,
  }),
  // (req, res) => {
  //   const token = jwt.sign({ id: req.user }, process.env.SECRET_JWT, {
  //     expiresIn: process.env.JWT_EXPIRATION,
  //   })
  //   res.json({
  //     success: true,
  //     message: "Login successful",
  //     token,
  //   })
  // }
  (req, res) => {
    const token = jwt.sign({ id: req.user }, process.env.SECRET_JWT, {
      expiresIn: process.env.JWT_EXPIRATION,
    })
    res.redirect(`zuraaya://app/token/${token}`)
  }
)
router.route("/auth/logout").get()

module.exports = router
