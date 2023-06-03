const express = require("express")
const { protect, authorize } = require("../middleware/auth")

const {
  getAllShippingMethods,
  createShippingMethod,
  getSingleShippingMethod,
  updateShippingMethod,
  deleteShippingMethod,
} = require("../controllers/shippingMethod")

const router = express.Router()

router
  .route("/")
  .get(protect, getAllShippingMethods)
  .post(protect, authorize("admin"), createShippingMethod)
router
  .route("/:methodId")
  .get(protect, getSingleShippingMethod)
  .put(protect, updateShippingMethod)
  .delete(protect, deleteShippingMethod)

module.exports = router
