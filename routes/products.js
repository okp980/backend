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
  getPopularProducts,
} = require("../controllers/products")
const { ImageUpload } = require("../middleware/fileUploadHandler")
const { protect, authorize } = require("../middleware/auth")
const { getProductShippingMethod } = require("../controllers/shippingMethod")
const Product = require("../models/Product")
const advancedResults = require("../middleware/advancedResults")
const router = express.Router()

router
  .route("/")
  .get(advancedResults(Product, "category sub_category"), getProducts)
  .post(protect, authorize("admin"), addProduct)
router.route("/new-arrival").get(getNewArrivalProducts)
router.route("/new-arrival").get(getNewArrivalProducts)
router
  .route("/popular-products")
  .get(advancedResults(Product, "category sub_category"), getPopularProducts)
router
  .route("/recommended")
  .get(advancedResults(Product), getRecommendedProducts)
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
