const CartProduct = require("../models/CartProduct")
const Order = require("../models/Order")
const Payment = require("../models/Payment")
const Product = require("../models/Product")
const ErrorResponse = require("../util/ErrorResponse")

const Paystack = require("paystack-api")(
  "sk_test_29d46db07d47e0d712862b9993ecc1a5d2deb182"
)

//@desc - make payment
//@route - POST api/v1/orders/:orderId/pay
// @access - Private
const makepayment = async (req, res, next) => {
  const { paymentMethod } = req.body
  try {
    const { orderId } = req.params

    const order = await Order.findById(orderId)
      .populate({ path: "items", populate: { path: "product" } })
      .populate("shippingAddress")

    if (!order) {
      return next(new ErrorResponse("No Order was found", 404))
    }

    const email = order.shippingAddress[0].email
    const amount = order.totalAmount

    // check if the quatity of the product available is not sufficient for the order
    // can occur if the order was created for long period of time and order users have purchased the product
    const productsUnavailable = order.items.filter(
      (prd) => prd.product.quantity < prd.count
    )
    if (productsUnavailable.length > 0) {
      // delete the user's order, let the user try to checkout again with the available quantity of products
      await order.deleteOne()
      return next(
        new ErrorResponse(
          "Available quantity for order product has changed, please try to add product to cart again and make your order",
          400
        )
      )
    }

    // All is well proceed with initilizing payment
    const options = {
      amount: amount * 100,
      email,
      // callback_url: `${req.protocol}://${req.hostname}/api/v1/orders/${orderId}/verify`, // former
      callback_url: `${req.protocol}://${req.headers.host}/api/v1/orders/${orderId}/verify`,
      currency: "NGN",
    }

    const data = await Paystack.transaction.initialize(options)
    // initialize the payment model for that order
    const payment = await Payment.create({
      order: orderId,
      paymentMethod,
      reference: data.data.reference,
    })
    // update the payment field for the order // remove the payment, i've done it in create order
    await order.updateOne({ payment, status: "processing" })

    res.status(201).json({
      message: data.message,
      success: true,
      data: {
        authorization_url: data.data.authorization_url,
        access_code: data.data.access_code,
      },
    })
  } catch (error) {
    next(error)
  }
}

//@desc - Verify payment of an order
//@route - GET api/v1/orders/:orderId/verify
// @access - Private
const verifyPayment = async (req, res, next) => {
  try {
    const { orderId } = req.params
    const { reference } = req.query
    // verify payment
    const data = await Paystack.transaction.verify({ reference })

    // update payment status for that order
    const payment = await Payment.findOne({ order: orderId })
    await payment.updateOne({ status: "success" })

    const order = await Order.findById(orderId).populate(
      "products shippingAddress"
    )

    // update the products in the database with new fields
    await Promise.all(
      order.products.map(
        async (product) =>
          await Product.findByIdAndUpdate(product.product, [
            {
              $set: {
                quantity: {
                  $subtract: ["$quantity", product.count],
                },
              },
            },
            {
              $set: {
                sold: {
                  $add: ["$sold", product.count],
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
          ])
      )
    )

    await order.updateOne({ payment: payment, status: "success" })
    await CartProduct.deleteMany()
    res
      .status(200)
      .json({ message: data.message, success: true, data: data.data })
  } catch (error) {
    next(error)
  }
}

module.exports = { makepayment, verifyPayment }
