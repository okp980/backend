const Attribute = require("../models/Attribute")
const AttributeValue = require("../models/AttributeValue")
const ErrorResponse = require("../util/ErrorResponse")

//@desc - Get all attributeValue
//@route - GET api/v1/attribute-values
//@route - GET api/v1/attributes/:attributeId/attribute-values
// @access - Private
exports.getAttributeValues = async function (req, res, next) {
  let attributeValues = []
  try {
    if (req.params.attributeId) {
      const attribute = await Attribute.findById(req.params.attributeId)
      if (!attribute) return next(new ErrorResponse("Attibute Not Found", 404))
      attributeValues = await AttributeValue.find({
        attribute: req.params.attributeId,
      }).populate("attribute", "name")
    } else {
      attributeValues = await AttributeValue.find()
    }
    res.status(200).json({
      success: true,
      count: attributeValues.length,
      data: attributeValues,
    })
  } catch (error) {
    next(error)
  }
}

//@desc - Create AttributeValue
//@route - POST api/v1/attributes/:attributeId/attribute-values
// @access - Private
exports.createAttributeValue = async function (req, res, next) {
  try {
    const attribute = await Attribute.findById(req.params.attributeId)
    if (!attribute) return next(new ErrorResponse("Attibute Not Found", 404))
    const attributeValue = await AttributeValue.create({
      ...req.body,
      attribute: req.params.attributeId,
    })
    res.status(201).json({ success: true, data: attributeValue })
  } catch (error) {
    next(error)
  }
}

//@desc - Update AttributeValue
//@route - PUT api/v1/attribute-values/:id
// @access - Private
exports.updateAttributeValue = async function (req, res, next) {
  try {
    let attributeValue = await AttributeValue.findById(req.params.id)
    if (!attributeValue)
      return next(new ErrorResponse("AttributeValue not found", 404))
    AttributeValue = await AttributeValue.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
    res.status(200).json({
      success: true,
      message: "AttributeValue updated successfully",
      data: attributeValue,
    })
  } catch (error) {
    next(error)
  }
}

//@desc - Delete AttributeValue
//@route - DELETE api/v1/attribute-values/:id
// @access - Private
exports.deleteAttributeValue = async function (req, res, next) {
  try {
    let attributeValue = await AttributeValue.findById(req.params.id)
    if (!attributeValue)
      return next(new ErrorResponse("AttributeValue not found", 404))
    attributeValue = await AttributeValue.findByIdAndDelete(req.params.id)
    res.status(200).json({
      success: true,
      message: "Attribute Value deleted successfully",
      data: {},
    })
  } catch (error) {
    next(error)
  }
}
