const express = require("express")
const { protect, authorize } = require("../middleware/auth")
const {
  createReview,
  updateReview,
  deleteReview,
  getReview,
  getReviews,
} = require("../controllers/review")

const router = express.Router({ mergeParams: true })

router
  .route("/")
  .get(getReviews)
  .post(protect, authorize("admin"), createReview)
router
  .route("/:reviewId")
  .get(protect, getReview)
  .put(protect, authorize("admin"), updateReview)
  .delete(protect, authorize("admin"), deleteReview)

module.exports = router
