const express = require("express")
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  updateProductImage,
} = require("../controllers/products")
const { ImageUpload } = require("../middleware/fileUploadHandler")
const { protect, authorize } = require("../middleware/auth")
const router = express.Router()

router
  .route("/")
  .get(getProducts)
  .post(protect, authorize("admin"), ImageUpload, addProduct)
router
  .route("/:id")
  .get(getProduct)
  .put(protect, authorize("admin"), updateProduct)
  .delete(protect, authorize("admin"), deleteProduct)
router
  .route("/:id/image")
  .put(protect, authorize("admin"), ImageUpload, updateProductImage)

module.exports = router
