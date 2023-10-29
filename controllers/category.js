const sharp = require("sharp")
const Category = require("../models/Category")
const Product = require("../models/Product")
const SubCategory = require("../models/SubCategory")
const ErrorResponse = require("../util/ErrorResponse")
const { runInTransaction, getAdvancedResults } = require("../util/helper")
const uploadToBucket = require("../util/s3")

//@desc -  Add Category
//@route - POST /api/v1/categories
//@access - Private
exports.addCategory = async (req, res, next) => {
  try {
    // send to S3
    req.file.buffer = await sharp(req.file.buffer)
      .resize(300)
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        force: true,
        quality: 80,
      })
      .toBuffer()
    const slug = Category.getSlug(req.body.name)
    const imageResult = await uploadToBucket(req.file, `category/${slug}`)

    const category = await Category.create({
      ...req.body,
      slug,
      image: imageResult.Location,
    })

    res.status(200).json({
      success: true,
      message: "Category created successfully",
      data: category,
    })
  } catch (error) {
    next(error)
  }
}
//@desc -  get all Categories
//@route - GET /api/v1/categories
//@access - Public
exports.getCategory = async (req, res, next) => {
  try {
    const result = await getAdvancedResults(req, Category)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}
//@desc -  get all Products in Category
//@route - GET /api/v1/categories/:id/products
//@access - Public
exports.getCategoryProducts = async (req, res, next) => {
  try {
    const id = req.params.id
    const products = await Product.find({ category: id })
    res
      .status(200)
      .json({ success: true, count: products.length, data: products })
  } catch (error) {
    next(error)
  }
}

//@desc -  update single Category
//@route - GET /api/v1/categories/:id
//@access - Public
exports.getSingleCategory = async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id)
    if (!category) {
      return new ErrorResponse("Category not found", 404)
    }

    res.status(200).json({ success: true, data: category })
  } catch (error) {
    next(error)
  }
}

//@desc -  update single Category
//@route - PUT /api/v1/categories/:id
//@access - Private
exports.updateCategory = async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id)
    if (!category) {
      return new ErrorResponse("Category not found", 404)
    }
    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
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

//@desc -  update single Category Image
//@route - PUT /api/v1/categories/:id/image
//@access - Private
exports.updateCategoryImage = async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id)
    if (!category) {
      return next(new ErrorResponse("Category not found", 404))
    }
    category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        image: req.image,
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
    next(error)
  }
}

//@desc -  delete  Category
//@route - DELETE /api/v1/subcategories/:id
//@access - Private
exports.deleteCategory = async (req, res, next) => {
  const id = req.params.id
  try {
    let category = await Category.findById(id)
    if (!category) {
      return new ErrorResponse("Category not found", 404)
    }
    const categoryImage = category.image
    await runInTransaction(async (session) => {
      await Product.deleteMany({ category: id }, { session })
      await SubCategory.deleteMany({ category: id }, { session })
      await category.deleteOne({ session })
      // TODO: Delete image associated with the category from the server/aws S3 bucket
    })
    res
      .status(200)
      .json({ success: true, message: "Deleted Successfully", data: {} })
  } catch (error) {
    next(error)
  }
}
