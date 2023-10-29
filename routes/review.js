const express = require("express")
const { protect, authorize } = require("../middleware/auth")
const {
  createReview,
  updateReview,
  deleteReview,
  getReview,
  getReviews,
} = require("../controllers/review")
const passport = require("passport")

const router = express.Router({ mergeParams: true })

router
  .route("/")
  .get(getReviews)
  .post(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    createReview
  )
router
  .route("/:reviewId")
  .get(passport.authenticate("jwt", { session: false }), getReview)
  .put(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    updateReview
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    deleteReview
  )

module.exports = router
