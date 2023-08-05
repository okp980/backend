const express = require("express")
const { protect, authorize } = require("../middleware/auth")
const {
  getAttributes,
  createAttribute,
  getAttribute,
  updateAttribute,
  deleteAttribute,
} = require("../controllers/attributes")
const AttributeValuesRouter = require("../routes/attributeValues")

const router = express.Router()

// re-route routes
router.use("/:attributeId/attribute-values", AttributeValuesRouter)

router
  .route("/")
  .get(protect, getAttributes)
  .post(protect, authorize("admin"), createAttribute)
router
  .route("/:attributeId")
  .get(protect, getAttribute)
  .put(protect, authorize("admin"), updateAttribute)
  .delete(protect, authorize("admin"), deleteAttribute)

module.exports = router
