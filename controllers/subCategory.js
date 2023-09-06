const Product = require("../models/Product")
const SubCategory = require("../models/SubCategory")
const ErrorResponse = require("../util/ErrorResponse")
const {
  deleteFile,
  runInTransaction,
  getAdvancedResults,
} = require("../util/helper")
const uploadToBucket = require("../util/s3")

//@desc -  Add SubCategory
//@route - POST /api/v1/subcategories

//@access - Private
exports.addSubCategory = async (req, res, next) => {
  try {
    // send to S3
    const imageResult = await uploadToBucket(req.file.path, req.file.filename)
    // delete file after upload
    await deleteFile("uploads", req.file.filename)
    const category = await SubCategory.create({
      ...req.body,
      image: imageResult.Location,
    })
    res.status(201).json({
      success: true,
      message: "Subcategory created successfully",
      data: category,
    })
  } catch (error) {
    await deleteFile("uploads", req.file.filename)
    next(error)
  }
}
//@desc -  get all SubCategories
//@route - GET /api/v1/subcategories
//@route - GET /api/v1/categories/:catID/subcategories
//@access - Public
exports.getSubcategory = async (req, res, next) => {
  const categoryId = req.params.catID
  try {
    const result = categoryId
      ? await getAdvancedResults(req, SubCategory, {
          query: { category: categoryId },
        })
      : await getAdvancedResults(req, SubCategory, {
          populate: [{ path: "category", select: "name" }],
        })
    // const categories = categoryId
    //   ? await SubCategory.find({ category: categoryId })
    //   : await SubCategory.find().populate("category", "name")

    res.status(200).json({ ...result })
  } catch (error) {
    next(error)
  }
}

//@desc -  get all Products in SubCategory
//@route - GET /api/v1/subcategories/:id/products
//@access - Public
exports.getSubCategoryProducts = async (req, res, next) => {
  try {
    const id = req.params.id
    const products = await Product.find({ sub_category: id })
      .populate("tags")
      .populate({
        path: "variants",
        populate: {
          path: "attributeValue",
          populate: "attribute",
        },
      })
      .populate("sub_category")
      .populate("category")
    res
      .status(200)
      .json({ success: true, count: products.length, data: products })
  } catch (error) {
    next(error)
  }
}

//@desc -  update single SubCategory
//@route - GET /api/v1/subcategories/:id
//@access - Public
exports.getSingleSubcategory = async (req, res, next) => {
  try {
    let category = await SubCategory.findById(req.params.id)
    if (!category) {
      return new ErrorResponse("SubCategory not found", 404)
    }

    res.status(200).json({ success: true, data: category })
  } catch (error) {
    next(error)
  }
}

//@desc -  update single SubCategory
//@route - PUT /api/v1/subcategories/:id
//@access - Private
exports.updateSubcategory = async (req, res, next) => {
  try {
    let category = await SubCategory.findById(req.params.id)
    if (!category) {
      return new ErrorResponse("SubCategory not found", 404)
    }
    category = await SubCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res
      .status(200)
      .json({ success: true, message: "Updated Successfully", data: category })
  } catch (error) {
    next(error)
  }
}

//@desc -  update single SubCategory Image
//@route - PUT /api/v1/subcategories/:id/image
//@access - Private
exports.updateSubcategoryImage = async (req, res, next) => {
  try {
    let category = await SubCategory.findById(req.params.id)
    if (!category) {
      return next(new ErrorResponse("Category not found", 404))
    }
    category = await SubCategory.findByIdAndUpdate(
      req.params.id,
      {
        image: req.image.name,
      },
      {
        new: true,
        runValidators: true,
      }
    )
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    })
  } catch (error) {
    await deleteFile("uploads", req.image.name)
    next(error)
  }
}

//@desc -  delete  SubCategory
//@route - DELETE /api/v1/subcategories/:id
//@access - Private
exports.deleteSubcategory = async (req, res, next) => {
  const id = req.params.id
  try {
    let category = await SubCategory.findById(id)
    if (!category) {
      return new ErrorResponse("SubCategory not found", 404)
    }
    await category.deleteOne()

    res
      .status(200)
      .json({ success: true, message: "Deleted Successfully", data: {} })
  } catch (error) {
    next(error)
  }
}
