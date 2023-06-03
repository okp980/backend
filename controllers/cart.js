const mongoose = require("mongoose")
const Cart = require("../models/Cart")
const Product = require("../models/Product")
const ErrorResponse = require("../util/ErrorResponse")
const CartProduct = require("../models/CartProduct")

//@desc - Get Single Cart
//@route - GET api/v1/cart
// @access - Private
exports.getCart = async function (req, res, next) {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("products")
    if (!cart) return res.status(200).json({ success: true, data: null })

    res.status(200).json({ success: true, data: cart })
  } catch (error) {
    next(error)
  }
}

//@desc - add to Cart
//@route - POST api/v1/cart/:productId
// @access - Private
exports.AddToCart = async function (req, res, next) {
  const { productId } = req.params
  const { cartId } = res.cookies

  // no cartId
  // no login user
  // login user
  // cartId is available //

  try {
    let cart = {}
    let product = await Product.findById(productId)
    if (!product) return next(new ErrorResponse("Product not found", 404))
    if (cartId) {
      cart = await Cart.findById(cartId)
    } else if (req.user.id) {
      cart = await Cart.find({ user: req.user.id })
    }

    if (!cart) {
      const cartProduct = await CartProduct.create({
        product: productId,
        price: product.price,
      })

      if (req.user.id) {
        cart = await Cart.create({
          products: [cartProduct._id],
          total: product.price,
          user: req.user.id,
        })
      } else {
        cart = await Cart.create({
          products: [cartProduct._id],
          total: product.price,
        })
      }
    } else {
      let cartProduct = await CartProduct.findOne({
        product: productId,
      }).populate("product")

      if (cartProduct) {
        cartProduct = await CartProduct.findOneAndUpdate(
          { product: productId },
          {
            $inc: { count: 1, price: product.price },
          },
          { new: true }
        ).populate("product")

        console.log("cartProduct", cartProduct)

        //increase count and total
        cart = await Cart.findOneAndUpdate(
          { user: req.user.id },

          {
            $inc: {
              total: product.price,
            },
          },

          { new: true }
        ).populate("products")
      } else {
        const newCartProduct = await CartProduct.create({
          product: productId,
          price: product.price,
        })
        // push item to cart and increment total
        cart = await Cart.findOneAndUpdate(
          { user: req.user.id },

          {
            $push: {
              products: newCartProduct,
            },
            $inc: {
              total: product.price,
            },
          },

          { new: true }
        )
      }
    }
    res.cookies("cartId", cart._id, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 10000, // 30 days
    })
    res.status(201).json({
      success: true,
      message: "Added to cart successfully",
      data: cart,
    })
  } catch (error) {
    next(error)
  }
}

//@desc - Update Cart
//@route - PUT api/v1/cart/:productId
// @access - Private
exports.updateCart = async function (req, res, next) {
  const { count } = req.body
  const productId = req.params.productId

  try {
    let cart = await Cart.findOne({ user: req.user.id })
    if (!cart) return next(new ErrorResponse("Cart not found for user", 404))
    let product = await Product.findById(productId)
    if (!product) return next(new ErrorResponse("Product not found", 404))

    //
    let cartProduct = await CartProduct.findOne({
      product: productId,
    }).populate("product")

    const total = cart.total - (cartProduct.price + product.price * count)

    if (!cartProduct)
      return next(new ErrorResponse("Cart not found for user", 404))
    cartProduct = await CartProduct.findOneAndUpdate(
      { product: productId },
      {
        $set: { count, price: product.price * count },
      },
      { new: true }
    ).populate("product")

    //

    cart = await Cart.findOneAndUpdate(
      { user: req.user.id },

      {
        $set: {
          total: total,
        },
      },

      { new: true }
    ).populate("products")

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: cart,
    })
  } catch (error) {
    next(error)
  }
}

//@desc - Delete Cart Item
//@route - DELETE api/v1/cart/:productId/item
// @access - Private
exports.deleteCartItem = async function (req, res, next) {
  const productId = req.params.productId
  try {
    let cart = await Cart.findOne({ user: req.user.id })
    if (!cart) return next(new ErrorResponse("Cart not found for user", 404))
    let product = await Product.findById(productId)
    if (!product) return next(new ErrorResponse("Product not found", 404))

    //

    let cartProduct = await CartProduct.findOne({
      product: productId,
    }).populate("product")
    if (!cartProduct)
      return next(new ErrorResponse("Product does not exist in cart", 404))

    const total = cart.total - cartProduct.price

    // await cartProduct.deleteOne()
    await CartProduct.findByIdAndDelete(cartProduct.id)

    cart = await Cart.findOneAndUpdate(
      { user: req.user.id },

      {
        $set: {
          total: total,
        },
      },

      { new: true }
    ).populate("products")

    console.log("total", cart.total)
    console.log("products", cart.products)

    if (cart.total === 0 && cart.products.length === 0) {
      cart = await cart.deleteOne()
    }

    //

    res.status(200).json({
      success: true,
      message: "Cart Item deleted successfully",
      data: cart,
    })
  } catch (error) {
    next(error)
  }
}

//@desc - Clear Cart
//@route - DELETE api/v1/cart/:cartId/clear
// @access - Private
exports.clearCart = async function (req, res, next) {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.cartId)
    if (!cart) {
      if (!cart) return next(new ErrorResponse("No cart found", 404))
    }
    // work this deleteMany, it should delete based on the cart or user not all the cart products in the databse
    await CartProduct.deleteMany()
    res
      .status(200)
      .json({ success: true, message: "Cart deleted successfully", data: {} })
  } catch (error) {
    next(error)
  }
}
