const express = require("express")
const {
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
  updateCategoryImage,
  getCategoryProducts,
  getSingleCategory,
} = require("../controllers/category")
const subcategoryRouter = require("./subcategory")
const tagRouter = require("./tags")
const { ImageUpload } = require("../middleware/fileUploadHandler")
const { protect, authorize } = require("../middleware/auth")
const upload = require("../util/fileUploader")
const passport = require("passport")

const router = express.Router()

//Re-route routes
router.use("/:catID/subcategories", subcategoryRouter)
router.use("/:id/tags", tagRouter)

router
  .route("/")
  .get(getCategory)
  .post(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    upload.single("image"),
    addCategory
  )

router
  .route("/:id")
  .get(getSingleCategory)
  .put(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    updateCategory
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    deleteCategory
  )
router.route("/:id/products").get(getCategoryProducts)
router
  .route("/:id/image")
  .put(
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    ImageUpload,
    updateCategoryImage
  )

module.exports = router
