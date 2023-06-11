const express = require("express")
const { protect } = require("../middleware/auth")

const {
  getCart,
  AddToCart,
  updateCart,
  updateCartItem,
  clearCart,
} = require("../controllers/cart")

const router = express.Router()

router.route("/").get(getCart).delete(clearCart).post(AddToCart)
router.route("/:productId").put(updateCart)

router.route("/:productId/item").put(updateCartItem)

module.exports = router
