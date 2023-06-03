const Product = require("../models/Product")
const SubCategory = require("../models/SubCategory")
const ErrorResponse = require("../util/ErrorResponse")
const { deleteFile, runInTransaction } = require("../util/helper")

//@desc -  Add SubCategory
//@route - POST /api/v1/subcategories

//@access - Private
exports.addSubCategory = async (req, res, next) => {
  try {
    const category = await SubCategory.create({
      ...req.body,
      image: req.image.name,
    })
    res.status(201).json({
      success: true,
      message: "Subcategory created successfully",
      data: category,
    })
  } catch (error) {
    await deleteFile("uploads", req.image.name)
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
    const categories = categoryId
      ? await SubCategory.find({ category: categoryId })
      : await SubCategory.find().populate("category", "name")

    res
      .status(200)
      .json({ success: true, count: categories.length, data: categories })
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
    const categoryImage = category.image
    await runInTransaction(async (session) => {
      await Product.deleteMany({ sub_category: id })
      await category.deleteOne({ session })
      await deleteFile("uploads", categoryImage)
    })

    res
      .status(200)
      .json({ success: true, message: "Deleted Successfully", data: {} })
  } catch (error) {
    next(error)
  }
}
