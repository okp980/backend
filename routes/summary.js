const express = require("express")
const { orderSummary } = require("../controllers/order")
const { protect } = require("../middleware/auth")
const passport = require("passport")

const router = express.Router()

router
  .route("/orders")
  .get(passport.authenticate("jwt", { session: false }), orderSummary)

module.exports = router
