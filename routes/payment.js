const express = require("express")
const { protect } = require("../middleware/auth")
const { makepayment, verifyPayment } = require("../controllers/payment")

const router = express.Router()

module.exports = router
