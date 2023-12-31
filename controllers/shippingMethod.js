const { addDays, format } = require("date-fns")

const Product = require("../models/Product")
const ShippingMethod = require("../models/ShippingMethod")
const ErrorResponse = require("../util/ErrorResponse")
const { getAdvancedResults } = require("../util/helper")
const Cart = require("../models/Cart")

//@desc - Get all shipping methods
//@route - GET api/v1/shipping-methods
// @access - Private
exports.getAllShippingMethods = async function (req, res, next) {
  try {
    const results = await getAdvancedResults(req, ShippingMethod)
    res.status(200).json(results)
  } catch (error) {
    next(error)
  }
}

//@desc - Get cost for shipping methods in order
//@route - GET api/v1/shipping-methods/orders/costs
// @access - Private
exports.getOrderShippingCost = async function (req, res, next) {
  const { cartId } = req.cookies
  try {
    const cart = await Cart.findById(cartId).populate({
      path: "products",
      populate: {
        path: "product",
        select: "name weight",
        populate: { path: "sub_category", select: "name" },
      },
    })
    if (!cart) return next(new ErrorResponse("No Items in cart", 400))

    const shippingMethods = await ShippingMethod.find().lean()

    const calculatedShippings = shippingMethods.map((shipping_item) => {
      const totalWeight = cart.products.reduce((acc, item) => {
        return acc + item.product.weight
      }, 0)

      return {
        ...shipping_item,
        charge: shipping_item.charge * totalWeight,
      }
    })

    res.status(200).json({ success: true, data: calculatedShippings })
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

//@desc - Get Single ShippingMethod
//@route - GET api/v1/products/:productId/shipping-methods
// @access - Public
exports.getProductShippingMethod = async function (req, res, next) {
  try {
    const product = await Product.findById(req.params.productId)
    if (!product) return next(new ErrorResponse("Product not found", 404))
    const methods = await ShippingMethod.find()

    const getDeliveryTime = (duration) => {
      const currentDate = new Date()
      const newDate = addDays(currentDate, duration)
      return `Estimated delivery time from ${format(
        newDate,
        "dd MMM yyyy"
      )} to ${format(addDays(newDate, 5), "dd MMM yyyy")}`
    }

    const productMethods = methods.map((method) => ({
      id: method.id,
      title: method.title,
      description: method.description,
      duration: getDeliveryTime(method.duration),
      charge: method.charge * product.weight,
    }))

    res.status(200).json({ success: true, data: productMethods })
  } catch (error) {
    next(error)
  }
}

//@desc - Create ShippingMethod
//@route - POST api/v1/shipping-methods
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
//@route - PUT api/v1/shipping-methods/:methodId
// @access - Private
exports.updateShippingMethod = async function (req, res, next) {
  try {
    let method = await ShippingMethod.findById(req.params.methodId)
    if (!method) return next(new ErrorResponse("ShippingMethod not found", 404))
    method = await ShippingMethod.findByIdAndUpdate(
      req.params.methodId,
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
//@route - DELETE api/v1/shipping-methods/:methodId
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
