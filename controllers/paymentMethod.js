const PaymentMethod = require("../models/PaymentMethod")
const ErrorResponse = require("../util/ErrorResponse")

//@desc - Get all PaymentMethods
//@route - GET api/v1/payment-methods
// @access - Private
exports.getPaymentMethods = async function (req, res, next) {
  try {
    const paymentMethods = await PaymentMethod.find()
    res.status(200).json({
      success: true,
      count: paymentMethods.length,
      data: paymentMethods,
    })
  } catch (error) {
    next(error)
  }
}

//@desc - Get Single PaymentMethod
//@route - GET api/v1/payment-methods/:methodId
// @access - Private
exports.getSinglePaymentMethod = async function (req, res, next) {
  try {
    const paymentMethod = await PaymentMethod.findById(req.params.methodId)
    if (!paymentMethod)
      return next(new ErrorResponse("Payment Method not found", 404))

    res.status(200).json({ success: true, data: paymentMethod })
  } catch (error) {
    next(error)
  }
}

//@desc - Create PaymentMethod
//@route - POST api/v1/payment-methods
// @access - Private
exports.createPaymentMethod = async function (req, res, next) {
  try {
    const paymentMethod = await PaymentMethod.create(req.body)
    res.status(201).json({ success: true, data: paymentMethod })
  } catch (error) {
    next(error)
  }
}

//@desc - Update PaymentMethod
//@route - PUT api/v1/payment-methods/:methodId
// @access - Private
exports.updatePaymentMethod = async function (req, res, next) {
  try {
    let paymentMethod = await PaymentMethod.findById(req.params.methodId)
    if (!paymentMethod)
      return next(new ErrorResponse("Payment Method not found", 404))
    paymentMethod = await PaymentMethod.findByIdAndUpdate(
      req.params.methodId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
    res.status(200).json({
      success: true,
      message: "Payment Method updated successfully",
      data: paymentMethod,
    })
  } catch (error) {
    next(error)
  }
}

//@desc - Delete PaymentMethod
//@route - DELETE api/v1/payment-methods/:methodId
// @access - Private
exports.deletePaymentMethod = async function (req, res, next) {
  try {
    let paymentMethod = await PaymentMethod.findById(req.params.methodId)
    if (!paymentMethod)
      return next(new ErrorResponse("PaymentMethod not found", 404))
    paymentMethod = await PaymentMethod.findByIdAndDelete(req.params.methodId)
    res.status(200).json({
      success: true,
      message: "Payment Method deleted successfully",
      data: {},
    })
  } catch (error) {
    next(error)
  }
}
