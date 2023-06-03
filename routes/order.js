const express = require("express")
const { protect, authorize } = require("../middleware/auth")

const {
  getOrders,
  getUserOrders,
  getSingleOrder,
  createOrder,
  updateOrdersStatus,
  deleteOrder,
} = require("../controllers/order")
const { makepayment, verifyPayment } = require("../controllers/payment")

const router = express.Router()

router
  .route("/")
  .get(protect, authorize("admin"), getOrders)
  .post(protect, createOrder)
router.route("/user").get(protect, getUserOrders)
router
  .route("/:orderId")
  .get(protect, getSingleOrder)
  .delete(protect, deleteOrder)
router
  .route("/:orderId/status")
  .put(protect, authorize("admin"), updateOrdersStatus)
router.route("/:orderId/pay").post(protect, makepayment)
router.route("/:orderId/verify").get(verifyPayment)

module.exports = router
