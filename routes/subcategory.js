const express = require("express")
const {
  getSubcategory,
  addSubCategory,
  updateSubcategory,
  deleteSubcategory,
  updateSubcategoryImage,
  getSubCategoryProducts,
} = require("../controllers/subCategory")
const { ImageUpload } = require("../middleware/fileUploadHandler")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router({ mergeParams: true })

router
  .route("/")
  .get(getSubcategory)
  .post(protect, authorize("admin"), ImageUpload, addSubCategory)
router
  .route("/:id")
  .put(protect, authorize("admin"), updateSubcategory)
  .delete(protect, authorize("admin"), deleteSubcategory)
router.route("/:id/products").get(getSubCategoryProducts)
router
  .route("/:id/image")
  .put(protect, authorize("admin"), ImageUpload, updateSubcategoryImage)

module.exports = router
