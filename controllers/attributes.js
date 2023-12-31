const Attribute = require("../models/Attribute")
const AttributeValue = require("../models/AttributeValue")
const ErrorResponse = require("../util/ErrorResponse")

//@desc - Get all Attributes
//@route - GET api/v1/attributes
// @access - Private
exports.getAttributes = async function (req, res, next) {
  try {
    const attributes = await Attribute.find().populate("values")
    res
      .status(200)
      .json({ success: true, count: attributes.length, data: attributes })
  } catch (error) {
    next(error)
  }
}

//@desc - Get Single Attribute
//@route - GET api/v1/attributes/:attributeId
// @access - Private
exports.getAttribute = async function (req, res, next) {
  try {
    const attribute = await Attribute.findById(req.params.attributeId).populate(
      "values"
    )
    if (!attribute) return next(new ErrorResponse("Attribute not found", 404))

    res.status(200).json({ success: true, data: attribute })
  } catch (error) {
    next(error)
  }
}

//@desc - Create Attribute
//@route - POST api/v1/attributes
// @access - Private
exports.createAttribute = async function (req, res, next) {
  const { name, values } = req.body
  try {
    const newAttribute = await Attribute.create({ name })
    await Promise.all(
      values.map(
        async (v) =>
          await AttributeValue.create({
            id: v.id,
            attribute: newAttribute.id,
            value: v.value,
            meta: v.meta,
          })
      )
    )
    res.status(201).json({ success: true, data: newAttribute })
  } catch (error) {
    next(error)
  }
}

//@desc - Update Attribute
//@route - PUT api/v1/attributes/:attributeId
// @access - Private
exports.updateAttribute = async function (req, res, next) {
  const { name, values } = req.body
  try {
    let attribute = await Attribute.findById(req.params.attributeId)

    if (!attribute) return next(new ErrorResponse("Attribute not found", 404))
    attribute = await Attribute.findByIdAndUpdate(
      req.params.attributeId,
      { name },
      {
        new: true,
        runValidators: true,
      }
    )
    // await Promise.all(
    //   values.map(
    //     async (v) => await AttributeValue.findOneAndDelete({ id: v.id })
    //   )
    // )
    await AttributeValue.deleteMany({ attribute: attribute.id })
    await Promise.all(
      values.map(
        async (v) =>
          await AttributeValue.create({
            // id: v.id,
            attribute: attribute.id,
            value: v.value,
            meta: v.meta,
          })
      )
    )
    res.status(200).json({
      success: true,
      message: "Attribute updated successfully",
      data: attribute,
    })
  } catch (error) {
    next(error)
  }
}

//@desc - Delete Attribute
//@route - DELETE api/v1/attributes/:attributeId
// @access - Private
exports.deleteAttribute = async function (req, res, next) {
  try {
    let attribute = await Attribute.findById(req.params.attributeId)
    if (!attribute) return next(new ErrorResponse("Attribute not found", 404))
    await AttributeValue.deleteMany({ attribute: req.params.attributeId })
    await Attribute.findByIdAndDelete(req.params.attributeId)
    res.status(200).json({
      success: true,
      message: "Attribute deleted successfully",
      data: {},
    })
  } catch (error) {
    next(error)
  }
}
