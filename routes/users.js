const express = require("express")
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
} = require("../controllers/users")
const { protect, authorize } = require("../middleware/auth")
const passport = require("passport")

const router = express.Router()

router
  .route("/")
  .get(getUsers)
  .post(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    createUser
  )
router
  .route("/:userId")
  .get(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    getUser
  )
  .put(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    updateUser
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    deleteUser
  )

module.exports = router
