const express = require("express")
const { protect } = require("../middleware/auth")

const {
  getAllShippingAddress,
  createShippingAddress,
  getSingleShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
  getAllUserShippingAddress,
  getUserDefaultShippingAddress,
  updateUserDefaultShippingAddress,
} = require("../controllers/shippingAddress")
const passport = require("passport")

const router = express.Router()

router
  .route("/")
  .get(passport.authenticate("jwt", { session: false }), getAllShippingAddress)
  .post(passport.authenticate("jwt", { session: false }), createShippingAddress)

router
  .route("/user")
  .get(
    passport.authenticate("jwt", { session: false }),
    getAllUserShippingAddress
  )
router
  .route("/user/default")
  .get(
    passport.authenticate("jwt", { session: false }),
    getUserDefaultShippingAddress
  )
router
  .route("/:addressId")
  .get(
    passport.authenticate("jwt", { session: false }),
    getSingleShippingAddress
  )
  .put(passport.authenticate("jwt", { session: false }), updateShippingAddress)
  .delete(
    passport.authenticate("jwt", { session: false }),
    deleteShippingAddress
  )
router
  .route("/:addressId/default")
  .put(
    passport.authenticate("jwt", { session: false }),
    updateUserDefaultShippingAddress
  )

module.exports = router
