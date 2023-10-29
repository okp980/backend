const express = require("express")
const { protect, authorize } = require("../middleware/auth")
const {
  getPaymentMethods,
  createPaymentMethod,
  getSinglePaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} = require("../controllers/paymentMethod")
const passport = require("passport")

const router = express.Router()

router
  .route("/")
  .get(passport.authenticate("jwt", { session: false }), getPaymentMethods)
  .post(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    createPaymentMethod
  )

router
  .route("/:methodId")
  .get(passport.authenticate("jwt", { session: false }), getSinglePaymentMethod)
  .put(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    updatePaymentMethod
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    deletePaymentMethod
  )

module.exports = router
