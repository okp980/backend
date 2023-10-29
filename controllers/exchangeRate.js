const ExchangeRate = require("../models/exchangeRate")
const Tag = require("../models/Tag")
const ErrorResponse = require("../util/ErrorResponse")
const { getAdvancedResults } = require("../util/helper")

//@desc - Get all Rate
//@route - GET api/v1/exchange-rates
// @access - Private
exports.getExchangeRates = async function (req, res, next) {
  try {
    const result = await ExchangeRate.find()

    res.status(200).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

//@desc - Get Single Rate
//@route - GET api/v1/exchange-rates/:id
// @access - Private
exports.getSingleExchangeRate = async function (req, res, next) {
  try {
    const rate = await ExchangeRate.findById(req.params.id)
    if (!rate) return next(new ErrorResponse("Rate Not Found", 404))
    res.status(200).json({ success: true, data: rate })
  } catch (error) {
    next(error)
  }
}

//@desc - Create Rate
//@route - POST api/v1/exchange-rates
// @access - Private
exports.createExchangeRate = async function (req, res, next) {
  try {
    const result = await ExchangeRate.create(req.body)

    res.status(200).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

//@desc - Update Tag
//@route - PUT api/v1/exchange-rates/:id
// @access - Private
exports.updateExchangeRate = async function (req, res, next) {
  try {
    let rate = await ExchangeRate.findById(req.params.id)
    if (!rate) return next(new ErrorResponse("Rate Not Found", 404))
    rate = await ExchangeRate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    res.status(200).json({
      success: true,
      message: "Rate updated successfully",
      data: rate,
    })
  } catch (error) {
    next(error)
  }
}

//@desc - Delete Tag
//@route - DELETE api/v1/exchange-rates/:id
// @access - Private
exports.deleteExchangeRate = async function (req, res, next) {
  try {
    let rate = await ExchangeRate.findById(req.params.id)
    if (!rate) return next(new ErrorResponse("Rate Not Found", 404))
    rate = await ExchangeRate.findByIdAndDelete(req.params.id)
    res
      .status(200)
      .json({ success: true, message: "Rate deleted successfully", data: {} })
  } catch (error) {
    next(error)
  }
}
