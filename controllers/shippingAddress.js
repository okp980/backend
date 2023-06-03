const ShippingAddress = require("../models/ShippingAddress")
const ErrorResponse = require("../util/ErrorResponse")

//@desc - Get all shipping adress
//@route - GET api/v1/shipping-address
// @access - Private
exports.getAllShippingAddress = async function (req, res, next) {
  try {
    const addresses = await ShippingAddress.find()
    res
      .status(200)
      .json({ success: true, count: addresses.length, data: addresses })
  } catch (error) {
    next(error)
  }
}

//@desc - Get Single ShippingAddress
//@route - GET api/v1/shipping-address/:addressId
// @access - Private
exports.getSingleShippingAddress = async function (req, res, next) {
  try {
    const address = await ShippingAddress.findById(req.params.addressId)
    if (!address)
      return next(new ErrorResponse("ShippingAddress not found", 404))

    res.status(200).json({ success: true, data: address })
  } catch (error) {
    next(error)
  }
}

//@desc - Create ShippingAddress
//@route - POST api/v1/shipping-address
// @access - Private
exports.createShippingAddress = async function (req, res, next) {
  try {
    const address = await ShippingAddress.create({
      ...req.body,
      user: req.user.id,
    })
    res.status(201).json({ success: true, data: address })
  } catch (error) {
    next(error)
  }
}

//@desc - Update ShippingAddress
//@route - PUT api/v1/shipping-address/:addressId
// @access - Private
exports.updateShippingAddress = async function (req, res, next) {
  try {
    let address = await ShippingAddress.findById(req.params.addressId)
    if (!address)
      return next(new ErrorResponse("ShippingAddress not found", 404))
    address = await ShippingAddress.findByIdAndUpdate(
      req.params.address,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
    res.status(200).json({
      success: true,
      message: "ShippingAddress updated successfully",
      data: address,
    })
  } catch (error) {
    next(error)
  }
}

//@desc - Delete ShippingAddress
//@route - DELETE api/v1/shipping-address/:addressId
// @access - Private
exports.deleteShippingAddress = async function (req, res, next) {
  try {
    let address = await ShippingAddress.findById(req.params.addressId)
    if (!address)
      return next(new ErrorResponse("ShippingAddress not found", 404))
    await ShippingAddress.findByIdAndDelete(req.params.addressId)
    res.status(200).json({
      success: true,
      message: "ShippingAddress deleted successfully",
      data: {},
    })
  } catch (error) {
    next(error)
  }
}
