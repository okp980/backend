const express = require("express")
const { protect, authorize } = require("../middleware/auth")

const {
  getAllShippingMethods,
  createShippingMethod,
  getSingleShippingMethod,
  updateShippingMethod,
  deleteShippingMethod,
  getOrderShippingCost,
} = require("../controllers/shippingMethod")
const passport = require("passport")

const router = express.Router()

router
  .route("/")
  .get(getAllShippingMethods)
  .post(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    createShippingMethod
  )
router
  .route("/:methodId")
  .get(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    getSingleShippingMethod
  )
  .put(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    updateShippingMethod
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    deleteShippingMethod
  )
router
  .route("/orders/cost")
  .get(passport.authenticate("jwt", { session: false }), getOrderShippingCost)

module.exports = router
