const Cart = require("../models/Cart")
const Order = require("../models/Order")
const OrderItem = require("../models/OrderItem")
const ShippingAddress = require("../models/ShippingAddress")
const ShippingMethod = require("../models/ShippingMethod")
const ErrorResponse = require("../util/ErrorResponse")

//@desc - Get all Orders
//@route - GET api/v1/orders
// @access - Private
exports.getOrders = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults)
  } catch (error) {
    next(error)
  }
}

//@desc - Get all Orders by user
//@route - GET api/v1/orders/user
// @access - Private
exports.getUserOrders = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults)
  } catch (error) {
    next(error)
  }
}

//@desc - Get single Order
//@route - GET api/v1/orders/:orderId
// @access - Private
exports.getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId).populate("payment")
    if (!order) {
      return next(new ErrorResponse("Order not found", 404))
    }
    res.status(200).json({ success: true, data: order })
  } catch (error) {
    next(error)
  }
}

//@desc - Create an Order
//@route - POST api/v1/orders
// @access - Private
exports.createOrder = async (req, res, next) => {
  const { shippingAddressId, shippingMethodId } = req.body
  try {
    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) return next(new ErrorResponse("No Cart was found for user", 404))

    const shippingMethod = await ShippingMethod.findById(shippingMethodId)
    if (!shippingMethod)
      return next(new ErrorResponse("Shipping method not found", 404))

    let totalAmount = cart?.totalAfterDiscount
      ? cart?.totalAfterDiscount
      : cart.total
    // Add shipping method charge to total
    totalAmount += shippingMethod.charge

    const newOrder = {
      user: req.user.id,
      totalAmount,
      shippingAddress: shippingAddressId,
      shippingMethod: shippingMethodId,
    }

    // order to get id to attach to order item
    const order = await new Order(newOrder)

    // create order item for each cart product
    const products = Promise.all(
      cart.products.map(async (item) => {
        const orderItem = await OrderItem.create({
          product: item.product,
          quantity: item.count,
          price: item.price,
          order: order.id,
        })
        return orderItem.id
      })
    )

    order.items = products

    await order.save()

    await cart.deleteOne()
    // clear cart stored in user cookie
    res.clearCookie("cartId")
    res.status(201).json({ success: true, data: order })
  } catch (error) {
    next(error)
  }
}

//@desc - update order status
//@route - PUT api/v1/orders/:orderId/status
// @access - Private
exports.updateOrdersStatus = async (req, res, next) => {
  const { status } = req.body
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    )
    if (!order) {
      return next(new ErrorResponse("Order not found", 404))
    }
    res.status(200).json({ success: true, data: order })
  } catch (error) {
    next(error)
  }
}

//@desc - delete order status
//@route - DELETE api/v1/orders/:orderId
// @access - Private
exports.deleteOrder = async (req, res, next) => {
  const { status } = req.body
  try {
    const order = await Order.findById(req.params.orderId)
    if (!order) {
      return next(new ErrorResponse("Order not found", 404))
    }
    await OrderItem.deleteMany({ order: req.params.orderId })
    await Order.findByIdAndDelete(req.params.orderId)

    res.status(200).json({ success: true, data: {} })
  } catch (error) {
    next(error)
  }
}
