const express = require("express")
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  updateProductImage,
  getNewArrivalProducts,
  getRecommendedProducts,
  getPopularProducts,
  getTrendingProducts,
  searchProducts,
} = require("../controllers/products")
const { ImageUpload } = require("../middleware/fileUploadHandler")
const { protect, authorize } = require("../middleware/auth")
const { getProductShippingMethod } = require("../controllers/shippingMethod")
const upload = require("../util/fileUploader")
const router = express.Router()
const ReviewRouter = require("./review")

// re-route routes
router.use("/:productId/reviews", ReviewRouter)

router
  .route("/")
  .get(getProducts)
  .post(
    protect,
    authorize("admin"),
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "gallery", maxCount: 8 },
    ]),
    addProduct
  )
router.route("/search/:keyword").get(searchProducts)
router.route("/new-arrival").get(getNewArrivalProducts)
router.route("/popular-products").get(getPopularProducts)
router.route("/recommended").get(getRecommendedProducts)
router.route("/trending").get(getTrendingProducts)
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
