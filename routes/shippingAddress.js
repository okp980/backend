const express = require("express")
const { protect } = require("../middleware/auth")

const {
  getAllShippingAddress,
  createShippingAddress,
  getSingleShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
} = require("../controllers/shippingAddress")

const router = express.Router()

router
  .route("/")
  .get(protect, getAllShippingAddress)
  .post(protect, createShippingAddress)
router
  .route("/:addressId")
  .get(protect, getSingleShippingAddress)
  .put(protect, updateShippingAddress)
  .delete(protect, deleteShippingAddress)

module.exports = router
