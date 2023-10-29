const express = require("express")
const {
  getTags,
  createTag,
  updateTag,
  deleteTag,
  getSingleTag,
} = require("../controllers/tags")
const { protect, authorize } = require("../middleware/auth")
const passport = require("passport")

const router = express.Router({ mergeParams: true })

router
  .route("/")
  .get(getTags)
  .post(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    createTag
  )
router
  .route("/:tagId")
  .put(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    updateTag
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    deleteTag
  )
router
  .route("/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    getSingleTag
  )

module.exports = router
