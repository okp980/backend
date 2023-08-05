const express = require("express")
const { getAnalytics } = require("../controllers/analytics")
const { protect, authorize } = require("../middleware/auth")

const Router = express.Router()

// Router.route("/").get(protect, authorize("admin"), getAnalytics)
Router.route("/").get(getAnalytics)

module.exports = Router
