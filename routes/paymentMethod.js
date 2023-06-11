const express = require("express")
const { protect, authorize } = require("../middleware/auth")
const {
  getPaymentMethods,
  createPaymentMethod,
  getSinglePaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} = require("../controllers/paymentMethod")

const router = express.Router()

router
  .route("/")
  .get(protect, getPaymentMethods)
  .post(protect, authorize("admin"), createPaymentMethod)

router
  .route("/:methodId")
  .get(protect, getSinglePaymentMethod)
  .put(protect, authorize("admin"), updatePaymentMethod)
  .delete(protect, authorize("admin"), deletePaymentMethod)

module.exports = router
