const express = require("express")
const { protect, authorize } = require("../middleware/auth")
const {
  getAttributeValues,
  createAttributeValue,
  getAttributeValue,
  updateAttributeValue,
  deleteAttributeValue,
} = require("../controllers/attributeValues")
const passport = require("passport")

const router = express.Router({ mergeParams: true })

router
  .route("/")
  .get(passport.authenticate("jwt", { session: false }), getAttributeValues)
  .post(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    createAttributeValue
  )
router
  .route("/:id")
  .put(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    updateAttributeValue
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    deleteAttributeValue
  )

module.exports = router
