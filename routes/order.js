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
} = require("../controllers/order")
const { makepayment } = require("../controllers/payment")
const advancedResults = require("../middleware/advancedResults")
const Order = require("../models/Order")

const router = express.Router()

router.route("/").get(protect, getOrders).post(protect, createOrder)
router.route("/user").get(protect, getUserOrders)

router
  .route("/:orderId")
  .get(protect, getSingleOrder)
  .delete(protect, deleteOrder)
router
  .route("/:orderId/status")
  .put(protect, authorize("admin"), updateOrdersStatus)
// router.route("/:orderId/pay").post(protect, makepayment) // deprecated
router.route("/:orderId/verify").get(verifyPayment)

module.exports = router
