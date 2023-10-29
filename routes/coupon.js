const express = require("express")
const { protect, authorize } = require("../middleware/auth")
const {
  getCoupons,
  createCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/coupon")
const passport = require("passport")

const router = express.Router()

router
  .route("/")
  .get(passport.authenticate("jwt", { session: false }), getCoupons)
  .post(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    createCoupon
  )
router
  .route("/:couponId")
  .get(passport.authenticate("jwt", { session: false }), getCoupon)
  .put(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    updateCoupon
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    deleteCoupon
  )

module.exports = router
