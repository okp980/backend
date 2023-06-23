const express = require("express")
const { protect } = require("../middleware/auth")

const {
  getCart,
  AddToCart,
  updateCartItem,
  clearCart,
  updateCartCount,
} = require("../controllers/cart")

const router = express.Router()

router.route("/").get(getCart).delete(clearCart).post(AddToCart)
router.route("/:cartId/cartProducts/:cartProductId").put(updateCartCount)

router.route("/:productId/item").put(updateCartItem)

module.exports = router
