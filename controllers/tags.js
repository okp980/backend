const Category = require("../models/Category")
const Tag = require("../models/Tag")
const ErrorResponse = require("../util/ErrorResponse")
const { getAdvancedResults } = require("../util/helper")

//@desc - Get all Tags
//@route - GET api/v1/tags
//@route - GET api/v1/categories/:id/tags
// @access - Private
exports.getTags = async function (req, res, next) {
  try {
    let tags = []
    let result
    if (req.params.id) {
      const category = await Category.findById(req.params.id)
      if (!category) return next(new ErrorResponse("Category Not Found", 404))

      result = await getAdvancedResults(req, Tag, {
        query: {
          category: req.params.id,
        },
        populate: ["category"],
      })
    } else {
      result = await getAdvancedResults(req, Tag, {
        populate: ["category"],
      })
    }
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

//@desc - Get Single Tags
//@route - GET api/v1/tags/:id
// @access - Private
exports.getSingleTag = async function (req, res, next) {
  try {
    const tag = await Tag.findById(req.params.id)
    if (!tag) return next(new ErrorResponse("Tag Not Found", 404))
    res.status(200).json({ success: true, data: tag })
  } catch (error) {
    next(error)
  }
}

//@desc - Create Tag
//@route - POST api/v1/categories/:id/tags
// @access - Private
exports.createTag = async function (req, res, next) {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) return next(new ErrorResponse("Category Not Found", 404))
    const tag = await Tag.create({
      ...req.body,
      category: req.params.id,
    })
    res.status(201).json({ success: true, data: tag })
  } catch (error) {
    next(error)
  }
}

//@desc - Update Tag
//@route - PUT api/v1/tags/:tagId
// @access - Private
exports.updateTag = async function (req, res, next) {
  try {
    let tag = await Tag.findById(req.params.tagId)
    if (!tag) return next(new ErrorResponse("Tag not found", 404))
    tag = await Tag.findByIdAndUpdate(req.params.tagId, req.body, {
      new: true,
      runValidators: true,
    })
    res.status(200).json({
      success: true,
      message: "Tag updated successfully",
      data: tag,
    })
  } catch (error) {
    next(error)
  }
}

//@desc - Delete Tag
//@route - DELETE api/v1/tags/:tagId
// @access - Private
exports.deleteTag = async function (req, res, next) {
  try {
    let tag = await Tag.findById(req.params.tagId)
    if (!tag) return next(new ErrorResponse("Tag not found", 404))
    tag = await Tag.findByIdAndDelete(req.params.tagId)
    res
      .status(200)
      .json({ success: true, message: "Tag deleted successfully", data: {} })
  } catch (error) {
    next(error)
  }
}
