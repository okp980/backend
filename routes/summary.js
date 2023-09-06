const express = require("express")
const { orderSummary } = require("../controllers/order")
const { protect } = require("../middleware/auth")

const router = express.Router()

router.route("/orders").get(protect, orderSummary)

module.exports = router
