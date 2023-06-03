const express = require("express")
const { protect, authorize } = require("../middleware/auth")
const {
  getCoupons,
  createCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/coupon")

const router = express.Router()

router
  .route("/")
  .get(protect, getCoupons)
  .post(protect, authorize("admin"), createCoupon)
router
  .route("/:couponId")
  .get(protect, getCoupon)
  .put(protect, authorize("admin"), updateCoupon)
  .delete(protect, authorize("admin"), deleteCoupon)

module.exports = router
