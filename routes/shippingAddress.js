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

const router = express.Router()

router
  .route("/")
  .get(protect, getAllShippingAddress)
  .post(protect, createShippingAddress)

router.route("/user").get(protect, getAllUserShippingAddress)
router.route("/user/default").get(protect, getUserDefaultShippingAddress)
router
  .route("/:addressId")
  .get(protect, getSingleShippingAddress)
  .put(protect, updateShippingAddress)
  .delete(protect, deleteShippingAddress)
router
  .route("/:addressId/default")
  .put(protect, updateUserDefaultShippingAddress)

module.exports = router
