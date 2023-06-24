const express = require("express")
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  updateProductImage,
  getNewArrivalProducts,
  getTrendingProducts,
  getRecommendedProducts,
} = require("../controllers/products")
const { ImageUpload } = require("../middleware/fileUploadHandler")
const { protect, authorize } = require("../middleware/auth")
const { getProductShippingMethod } = require("../controllers/shippingMethod")
const Product = require("../models/Product")
const advancedResults = require("../middleware/advancedResults")
const router = express.Router()

router
  .route("/")
  .get(advancedResults(Product), getProducts)
  .post(protect, authorize("admin"), ImageUpload, addProduct)
router.route("/new-arrival").get(getNewArrivalProducts)
router.route("/trending").get(getTrendingProducts)
router.route("/recommended").get(getRecommendedProducts)
router
  .route("/:id")
  .get(getProduct)
  .put(protect, authorize("admin"), updateProduct)
  .delete(protect, authorize("admin"), deleteProduct)
router.route("/:productId/shipping-methods").get(getProductShippingMethod)
router
  .route("/:id/image")
  .put(protect, authorize("admin"), ImageUpload, updateProductImage)

module.exports = router
