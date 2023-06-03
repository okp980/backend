const ShippingMethod = require("../models/ShippingMethod")
const ErrorResponse = require("../util/ErrorResponse")

//@desc - Get all shipping methods
//@route - GET api/v1/shipping-methods
// @access - Private
exports.getAllShippingMethods = async function (req, res, next) {
  try {
    const methods = await ShippingMethod.find()
    res
      .status(200)
      .json({ success: true, count: methods.length, data: methods })
  } catch (error) {
    next(error)
  }
}

//@desc - Get Single ShippingMethod
//@route - GET api/v1/shipping-methods/:methodId
// @access - Private
exports.getSingleShippingMethod = async function (req, res, next) {
  try {
    const method = await ShippingMethod.findById(req.params.methodId)
    if (!method) return next(new ErrorResponse("ShippingMethod not found", 404))

    res.status(200).json({ success: true, data: method })
  } catch (error) {
    next(error)
  }
}

//@desc - Create ShippingMethod
//@route - POST api/v1/shipping-method
// @access - Private
exports.createShippingMethod = async function (req, res, next) {
  try {
    const method = await ShippingMethod.create(req.body)
    res.status(201).json({ success: true, data: method })
  } catch (error) {
    next(error)
  }
}

//@desc - Update ShippingMethod
//@route - PUT api/v1/shipping-method/:methodId
// @access - Private
exports.updateShippingMethod = async function (req, res, next) {
  try {
    let method = await ShippingMethod.findById(req.params.methodId)
    if (!method) return next(new ErrorResponse("ShippingMethod not found", 404))
    method = await ShippingMethod.findByIdAndUpdate(
      req.params.method,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
    res.status(200).json({
      success: true,
      message: "ShippingMethod updated successfully",
      data: method,
    })
  } catch (error) {
    next(error)
  }
}

//@desc - Delete ShippingMethod
//@route - DELETE api/v1/shipping-method/:methodId
// @access - Private
exports.deleteShippingMethod = async function (req, res, next) {
  try {
    let method = await ShippingMethod.findById(req.params.methodId)
    if (!method) return next(new ErrorResponse("ShippingMethod not found", 404))
    await ShippingMethod.findByIdAndDelete(req.params.methodId)
    res.status(200).json({
      success: true,
      message: "ShippingMethod deleted successfully",
      data: {},
    })
  } catch (error) {
    next(error)
  }
}
