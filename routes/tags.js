const express = require("express")
const {
  getTags,
  createTag,
  updateTag,
  deleteTag,
} = require("../controllers/tags")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router({ mergeParams: true })

router
  .route("/")
  .get(protect, getTags)
  .post(protect, authorize("admin"), createTag)
router
  .route("/:tagId")
  .put(protect, authorize("admin"), updateTag)
  .delete(protect, authorize("admin"), deleteTag)

module.exports = router
