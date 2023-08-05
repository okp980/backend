const express = require("express")
const { protect, authorize } = require("../middleware/auth")
const {
  getAttributeValues,
  createAttributeValue,
  getAttributeValue,
  updateAttributeValue,
  deleteAttributeValue,
} = require("../controllers/attributeValues")

const router = express.Router({ mergeParams: true })

router
  .route("/")
  .get(protect, getAttributeValues)
  .post(protect, authorize("admin"), createAttributeValue)
router
  .route("/:id")
  .put(protect, authorize("admin"), updateAttributeValue)
  .delete(protect, authorize("admin"), deleteAttributeValue)

module.exports = router
