const express = require("express")
const {
  getTags,
  createTag,
  updateTag,
  deleteTag,
  getSingleTag,
} = require("../controllers/tags")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router({ mergeParams: true })

router.route("/").get(getTags).post(protect, authorize("admin"), createTag)
router
  .route("/:tagId")
  .put(protect, authorize("admin"), updateTag)
  .delete(protect, authorize("admin"), deleteTag)
router.route("/:id").get(protect, authorize("admin"), getSingleTag)

module.exports = router
