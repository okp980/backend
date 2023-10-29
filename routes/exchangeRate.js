const express = require("express")

const { protect, authorize } = require("../middleware/auth")
const passport = require("passport")
const {
  getExchangeRates,
  createExchangeRate,
  updateExchangeRate,
  deleteExchangeRate,
  getSingleExchangeRate,
} = require("../controllers/exchangeRate")

const router = express.Router()

router
  .route("/")
  .get(getExchangeRates)
  .post(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    createExchangeRate
  )
router
  .route("/:id")
  .put(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    updateExchangeRate
  )
//   .delete(
//     passport.authenticate("jwt", { session: false }),
//     authorize("admin"),
//     deleteExchangeRate
//   ) // TODO: Revisit this
router
  .route("/:id")
  .get(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    getSingleExchangeRate
  )

module.exports = router
