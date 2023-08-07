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
  .get(getAllShippingMethods)
  .post(protect, authorize("admin"), createShippingMethod)
router
  .route("/:methodId")
  .get(protect, authorize("admin"), getSingleShippingMethod)
  .put(protect, authorize("admin"), updateShippingMethod)
  .delete(protect, authorize("admin"), deleteShippingMethod)

module.exports = router
