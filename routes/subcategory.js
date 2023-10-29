const express = require("express")
const {
  getSubcategory,
  addSubCategory,
  updateSubcategory,
  deleteSubcategory,
  updateSubcategoryImage,
  getSubCategoryProducts,
  getSingleSubcategory,
} = require("../controllers/subCategory")
const { ImageUpload } = require("../middleware/fileUploadHandler")
const { protect, authorize } = require("../middleware/auth")
const upload = require("../util/fileUploader")
const passport = require("passport")

const router = express.Router({ mergeParams: true })

router
  .route("/")
  .get(getSubcategory)
  .post(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    upload.single("image"),
    addSubCategory
  )
router
  .route("/:id")
  .get(getSingleSubcategory)
  .put(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    updateSubcategory
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    deleteSubcategory
  )
router.route("/:id/products").get(getSubCategoryProducts)
router
  .route("/:id/image")
  .put(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    ImageUpload,
    updateSubcategoryImage
  )

module.exports = router
