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
const passport = require("passport")

const router = express.Router()

// re-route routes
router.use("/:attributeId/attribute-values", AttributeValuesRouter)

router
  .route("/")
  .get(getAttributes)
  .post(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    createAttribute
  )
router
  .route("/:attributeId")
  .get(passport.authenticate("jwt", { session: false }), getAttribute)
  .put(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    updateAttribute
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    deleteAttribute
  )

module.exports = router
