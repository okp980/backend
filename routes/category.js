const express = require("express")
const {
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
  updateCategoryImage,
} = require("../controllers/category")
const subcategoryRouter = require("./subcategory")
const { ImageUpload } = require("../middleware/fileUploadHandler")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

//Re-route routes
router.use("/:catID/subcategories", subcategoryRouter)

router
  .route("/")
  .get(getCategory)
  .post(protect, authorize("admin"), ImageUpload, addCategory)
router
  .route("/:id")
  .put(protect, authorize("admin"), updateCategory)
  .delete(protect, authorize("admin"), deleteCategory)
router
  .route("/:id/image")
  .put(protect, authorize("admin"), ImageUpload, updateCategoryImage)

module.exports = router
