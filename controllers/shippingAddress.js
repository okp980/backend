const ShippingAddress = require("../models/ShippingAddress")
const ErrorResponse = require("../util/ErrorResponse")

//@desc - Get all shipping adress
//@route - GET api/v1/shipping-address
// @access - Private
exports.getAllShippingAddress = async function (req, res, next) {
  try {
    const addresses = await ShippingAddress.find()
    if (!addresses)
      return next(new ErrorResponse("ShippingAddress not found", 404))

    res
      .status(200)
      .json({ success: true, count: addresses.length, data: addresses })
  } catch (error) {
    next(error)
  }
}

//@desc - Get all shipping adress
//@route - GET api/v1/shipping-address/user
// @access - Private
exports.getAllUserShippingAddress = async function (req, res, next) {
  try {
    const addresses = await ShippingAddress.find({ user: req.user.id })
    if (!addresses)
      return next(new ErrorResponse("ShippingAddress not found for user", 404))
    res
      .status(200)
      .json({ success: true, count: addresses.length, data: addresses })
  } catch (error) {
    next(error)
  }
}

//@desc - Get all shipping adress
//@route - GET api/v1/shipping-address/user/default
// @access - Private
exports.getUserDefaultShippingAddress = async function (req, res, next) {
  try {
    const address = await ShippingAddress.findOne({
      user: req.user.id,
      default: true,
    })
    if (!address)
      return next(new ErrorResponse("ShippingAddress not found for user", 404))
    res.status(200).json({ success: true, data: address })
  } catch (error) {
    next(error)
  }
}

//@desc - make default shipping adress
//@route - PUT api/v1/shipping-address/:addressId/default
// @access - Private
exports.updateUserDefaultShippingAddress = async function (req, res, next) {
  try {
    let address = await ShippingAddress.findById(req.params.addressId)
    if (!address)
      return next(new ErrorResponse("ShippingAddress not found for user", 404))
    await ShippingAddress.updateMany(
      {
        user: req.user.id,
      },
      { $set: { default: false } }
    )
    address = await ShippingAddress.findByIdAndUpdate(
      req.params.addressId,
      { default: true },
      {
        new: true,
      }
    )

    res.status(200).json({ success: true, data: address })
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
    const allUserAddresses = await ShippingAddress.find({ user: req.user.id })
    if (allUserAddresses.length > 0) {
      await Promise.all(
        allUserAddresses.map(
          async (add) =>
            await ShippingAddress.findByIdAndUpdate(add.id, { default: false })
        )
      )
    }
    const address = await ShippingAddress.create({
      ...req.body,
      default: true,
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
  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    country,
    state,
    lga,
    address: addressFromBody,
  } = req.body
  try {
    let address = await ShippingAddress.findById(req.params.addressId)
    if (!address)
      return next(new ErrorResponse("ShippingAddress not found", 404))
    address = await ShippingAddress.findByIdAndUpdate(
      req.params.addressId,
      {
        firstName,
        lastName,
        phoneNumber,
        email,
        country,
        state,
        lga,
        address: addressFromBody,
      },
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
