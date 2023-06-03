const express = require("express")
const { protect } = require("../middleware/auth")

const {
  getCart,
  AddToCart,
  updateCart,
  deleteCartItem,
  clearCart,
} = require("../controllers/cart")

const router = express.Router()

router.route("/").get(protect, getCart).post()
router.route("/:productId").post(protect, AddToCart).put(protect, updateCart)

router.route("/:productId/item").delete(protect, deleteCartItem)
router.route("/:cartId/clear").delete(protect, clearCart)

module.exports = router
