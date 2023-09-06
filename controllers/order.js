const { default: mongoose } = require("mongoose")
const Cart = require("../models/Cart")
const Order = require("../models/Order")
const OrderItem = require("../models/OrderItem")
const Payment = require("../models/Payment")
const ShippingAddress = require("../models/ShippingAddress")
const Variation = require("../models/variation")
const ShippingMethod = require("../models/ShippingMethod")
const ErrorResponse = require("../util/ErrorResponse")
const { getAdvancedResults } = require("../util/helper")
const Product = require("../models/Product")
const CartProduct = require("../models/CartProduct")
const Review = require("../models/Review")
const { statusStages } = require("../util/contants")

const Paystack = require("paystack-api")(
  "sk_test_29d46db07d47e0d712862b9993ecc1a5d2deb182"
)

//@desc - Get all Orders
//@route - GET api/v1/orders
// @access - Private
exports.getOrders = async (req, res, next) => {
  try {
    const result = await getAdvancedResults(req, Order, {
      populate: ["shippingMethod shippingAddress"],
    })
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

//@desc - Get all Orders by user
//@route - GET api/v1/orders/user
// @access - Private
exports.getUserOrders = async (req, res, next) => {
  try {
    let query

    let queryStr = JSON.stringify(req.query)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    )

    // parsed query

    queryStr = JSON.parse(queryStr)

    // fields to remove
    const removeFields = ["select", "sort", "page", "limit"]

    removeFields.forEach((item) => {
      if (queryStr[item]) {
        delete queryStr[item]
      }
    })

    query = Order.find({ user: req.user.id, ...queryStr })
      .populate({
        path: "items",
        populate: { path: "product", select: "name price image" },
      })
      .populate("shippingMethod", "title charge")
      .populate({
        path: "payment",
        populate: { path: "paymentMethod", select: "name" },
        select: "paymentMethod",
      })

    // select field
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ")
      query.select(fields)
    }

    // sort by
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ")
      query.sort(sortBy)
    } else {
      query.sort("-createdAt")
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 5
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Order.countDocuments()

    query = query.skip(startIndex).limit(limit)

    const pagination = { current: page, limit }

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      }
    }

    if (startIndex > 0) {
      pagination.previous = {
        page: page - 1,
        limit,
      }
    }

    const result = await query

    res.status(200).json({
      success: true,
      count: result.length,

      pagination,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

//@desc - Get single Order
//@route - GET api/v1/orders/:orderId
// @access - Private
exports.getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate({
        path: "items",
        populate: { path: "product", select: "name price image" },
      })
      .populate("shippingMethod shippingAddress")
      .populate({
        path: "payment",
        populate: { path: "paymentMethod", select: "name" },
        select: "paymentMethod",
      })

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
  const { shippingAddressId, shippingMethodId, paymentMethodId } = req.body
  const { cartId } = req.cookies
  let paystackData = {}
  let order_id = ""

  try {
    // start a session
    const session = await mongoose.startSession()

    await session.withTransaction(async () => {
      const cart = await Cart.findById(cartId).populate("products")
      if (!cart) return next(new ErrorResponse("No Cart was found", 404))
      cart.user = req.user.id
      await cart.save({ session })
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

      console.log("CART ==>", cart)

      // create order item for each cart product
      const products = await Promise.all(
        cart.products.map(async (item, index) => {
          const variable_product = await Variation.findById(item?.variant)

          const orderItem = await new OrderItem({
            product: item.product,
            quantity: item.count,
            price: item.price,
            order: order.id,
            variant: item?.variant,
          })

          await orderItem.save({ session })

          return orderItem.id
        })
      )

      order.items = products

      // save the order
      await order.save({ session })

      // get order inordr to get shipping email
      const shippingAddress = await ShippingAddress.findById(shippingAddressId)

      const email = shippingAddress.email
      const amount = order.totalAmount

      // COME BACK TO THIS PRODUCT CAN BE SIMPLE OR VARIABLE SO QTY SHOULD BE ................
      // check if the quatity of the product available is not sufficient for the order
      // can occur if the order was created for long period of time and order users have purchased the product
      // const productsUnavailable = order.items.filter(
      //   (prd) => prd.product.quantity < prd.count
      // )
      // if (productsUnavailable.length > 0) {
      //   // delete the user's order, let the user try to checkout again with the available quantity of products
      //   await order.deleteOne()
      //   res.clearCookie("cartId")
      //   return next(
      //     new ErrorResponse(
      //       "Available quantity for order product has changed, please try to add product to cart again and make your order",
      //       400
      //     )
      //   )
      // }

      // All is well proceed with initilizing payment
      const options = {
        amount: amount * 100,
        email,
        // callback_url: `${req.protocol}://${req.hostname}/api/v1/orders/${order.id}/verify`, // former
        callback_url: `${req.protocol}://${req.headers.host}/api/v1/orders/${order.id}/verify`,
        currency: "NGN",
      }

      paystackData = await Paystack.transaction.initialize(options)

      // create order payment
      const payment = await Payment.create(
        [
          {
            order: order.id,
            paymentMethod: paymentMethodId,
            reference: paystackData.data.reference,
          },
        ],
        { session }
      )

      // update the payment field for the order
      await order.updateOne({ payment: payment.id }, { session })
      order_id = order.id

      // remove cart and items from database
      await CartProduct.deleteMany({ cart: cart.id }, { session })
      await cart.deleteOne({ session })
    })

    // end session
    session.endSession()

    // clear cart stored in user cookie
    res.clearCookie("cartId")
    res.status(201).json({
      success: true,
      data: {
        order_id,
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
      },
    })
  } catch (error) {
    next(error)
  }
}

//@desc - Verify payment of an order
//@route - GET api/v1/orders/:orderId/verify
// @access - Private
exports.verifyPayment = async (req, res, next) => {
  let data = {}
  try {
    // start a session
    const session = await mongoose.startSession()
    await session.withTransaction(async () => {
      const { orderId } = req.params
      const { reference } = req.query
      // verify payment
      data = await Paystack.transaction.verify({ reference })

      // update payment status for that order
      await Payment.findOneAndUpdate(
        { order: orderId },
        { status: "success" },
        { session }
      )

      const order = await Order.findById(orderId).populate(
        "items shippingAddress"
      )

      // update the products in the database with new fields
      await Promise.all(
        order.items.map(async (product) => {
          if (!product?.variant) {
            return await Product.findByIdAndUpdate(
              product.product,
              [
                {
                  $set: {
                    quantity: {
                      $subtract: ["$quantity", product.quantity],
                    },
                  },
                },
                {
                  $set: {
                    sold: {
                      $add: ["$sold", product.quantity],
                    },
                  },
                },
                {
                  $set: {
                    inStock: {
                      $cond: [
                        {
                          $eq: ["$quantity", 0],
                        },
                        false,

                        true,
                      ],
                    },
                  },
                },
              ],
              { session }
            )
          } else {
            return await Variation.findByIdAndUpdate(
              product.variant,
              [
                {
                  $set: {
                    quantity: {
                      $subtract: ["$quantity", product.quantity],
                    },
                  },
                },
                {
                  $set: {
                    sold: {
                      $add: ["$sold", product.quantity],
                    },
                  },
                },
                {
                  $set: {
                    inStock: {
                      $cond: [
                        {
                          $eq: ["$quantity", 0],
                        },
                        false,

                        true,
                      ],
                    },
                  },
                },
              ],
              { session }
            )
          }
        })
      )

      const ord = await Order.findByIdAndUpdate(
        order.id,
        { status: "processing" },
        { session, new: true, runValidators: true }
      )

      console.log("CHANGED ORDER ===>", ord)
      // await order.updateOne({ }, { session })
    })

    // end session
    session.endSession()
    res
      .status(200)
      .json({ message: data.message, success: true, data: data.data })
  } catch (error) {
    console.log("EEROR", error)
    next(error)
  }
}

//@desc - update order status
//@route - PUT api/v1/orders/:orderId/status
// @access - Private
exports.updateOrdersStatus = async (req, res, next) => {
  const { status } = req.body
  const isStatusType = statusStages.some((st) => st === status)
  if (!isStatusType)
    return next(new ErrorResponse("Status type incorrect", 400))
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    )
    if (!order) {
      return next(new ErrorResponse("Order not found", 404))
    }
    // send FCM to device here and Email to user e-mail ====> implement later
    res.status(200).json({ success: true, data: order })
  } catch (error) {
    next(error)
  }
}

//@desc - update order status
//@route - PUT api/v1/summary/orders
// @access - Private
exports.orderSummary = async (req, res, next) => {
  try {
    const unpaidOrder = await Order.find({
      user: req.user.id,
      status: "pending",
    })
    const processingOrder = await Order.find({
      user: req.user.id,
      status: "processing",
    })
    const shippedOrder = await Order.find({
      user: req.user.id,
      status: {
        $in: [
          "shipment sent to china frieghtya",
          "arrived china sorting center",
          "shipment left china to nigeria",
          "customs clearing at lagos nigeria",
        ],
      },
    })
    const refundedOrder = await Order.find({
      user: req.user.id,
      refunded: true,
    })
    const reviews = await Review.find({ user: req.user.id })
    res.status(200).json({
      success: true,
      data: {
        unpaid: unpaidOrder.length,
        processing: processingOrder.length,
        shipped: shippedOrder.length,
        return: refundedOrder.length,
        review: reviews.length,
      },
    })
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
