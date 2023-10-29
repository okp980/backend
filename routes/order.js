const express = require("express")
const { protect, authorize } = require("../middleware/auth")

const {
  getOrders,
  getUserOrders,
  getSingleOrder,
  createOrder,
  updateOrdersStatus,
  deleteOrder,
  verifyPayment,
  orderSummary,
  payUnpaidOrders,
} = require("../controllers/order")
const { makepayment } = require("../controllers/payment")
const advancedResults = require("../middleware/advancedResults")
const Order = require("../models/Order")
const passport = require("passport")

const router = express.Router()

router
  .route("/")
  .get(passport.authenticate("jwt", { session: false }), getOrders)
  .post(passport.authenticate("jwt", { session: false }), createOrder)
router
  .route("/user")
  .get(passport.authenticate("jwt", { session: false }), getUserOrders)

router
  .route("/:orderId")
  .get(passport.authenticate("jwt", { session: false }), getSingleOrder)
  .delete(passport.authenticate("jwt", { session: false }), deleteOrder)
router
  .route("/:orderId/status")
  .put(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    updateOrdersStatus
  )
// router.route("/:orderId/pay").post(passport.authenticate("jwt", { session: false }), makepayment) // deprecated
router.route("/:orderId/verify").get(verifyPayment)
router.route("/:orderId/pay").get(payUnpaidOrders)

module.exports = router
