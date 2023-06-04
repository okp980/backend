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

router.route("/").get(getCart).delete(clearCart)
router.route("/:productId").post(AddToCart).put(protect, updateCart)

router.route("/:productId/item").delete(deleteCartItem)

module.exports = router
