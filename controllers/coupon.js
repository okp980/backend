const Coupon = require("../models/Coupon")
const ErrorResponse = require("../util/ErrorResponse")

//@desc - Get all Coupons
//@route - GET api/v1/coupons
// @access - Private
exports.getCoupons = async function (req, res, next) {
  try {
    const coupons = await Coupon.find()
    res
      .status(200)
      .json({ success: true, count: coupons.length, data: coupons })
  } catch (error) {
    next(error)
  }
}

//@desc - Get Single Coupon
//@route - GET api/v1/coupons/:couponId
// @access - Private
exports.getCoupon = async function (req, res, next) {
  try {
    const coupon = await Coupon.findById(req.params.couponId)
    if (!coupon) return next(new ErrorResponse("Coupon not found", 404))

    res.status(200).json({ success: true, data: coupon })
  } catch (error) {
    next(error)
  }
}

//@desc - Create Coupon
//@route - POST api/v1/coupons/:couponId
// @access - Private
exports.createCoupon = async function (req, res, next) {
  try {
    const coupon = await Coupon.create(req.body)
    res.status(201).json({ success: true, data: coupon })
  } catch (error) {
    next(error)
  }
}

//@desc - Update Coupon
//@route - PUT api/v1/coupons/:couponId
// @access - Private
exports.updateCoupon = async function (req, res, next) {
  try {
    let coupon = await Coupon.findById(req.params.couponId)
    if (!coupon) return next(new ErrorResponse("Coupon not found", 404))
    coupon = await Coupon.findByIdAndUpdate(req.params.couponId, req.body, {
      new: true,
      runValidators: true,
    })
    res
      .status(200)
      .json({
        success: true,
        message: "Coupon updated successfully",
        data: coupon,
      })
  } catch (error) {
    next(error)
  }
}

//@desc - Delete Coupon
//@route - DELETE api/v1/coupons/:couponId
// @access - Private
exports.deleteCoupon = async function (req, res, next) {
  try {
    let coupon = await Coupon.findById(req.params.couponId)
    if (!coupon) return next(new ErrorResponse("Coupon not found", 404))
    coupon = await Coupon.findByIdAndDelete(req.params.couponId)
    res
      .status(200)
      .json({ success: true, message: "Coupon deleted successfully", data: {} })
  } catch (error) {
    next(error)
  }
}
