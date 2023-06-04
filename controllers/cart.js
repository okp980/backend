const mongoose = require("mongoose")
const Cart = require("../models/Cart")
const Product = require("../models/Product")
const ErrorResponse = require("../util/ErrorResponse")
const CartProduct = require("../models/CartProduct")

//@desc - Get Single Cart
//@route - GET api/v1/cart
// @access - Private
exports.getCart = async function (req, res, next) {
  const { cartId } = req.cookies

  try {
    const cart = await Cart.findOne({
      _id: cartId,
    }).populate("products")
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
  const { cartId } = req.cookies

  try {
    let cart = null
    let product = await Product.findById(productId)
    if (!product) return next(new ErrorResponse("Product not found", 404))
    if (cartId) {
      cart = await Cart.findById(cartId)
    }

    if (!cart) {
      const cartProduct = await new CartProduct({
        product: productId,
        price: product.price,
      })

      cart = await Cart.create({
        products: [cartProduct._id],
        total: product.price,
      })
      cartProduct.cart = cart._id
      await cartProduct.save()
    } else {
      let cartProduct = await CartProduct.findOne({
        product: productId,
        cart: cartId,
      }).populate("product")

      if (cartProduct) {
        cartProduct = await CartProduct.findOneAndUpdate(
          { product: productId, cart: cartId },
          {
            $inc: { count: 1, price: product.price },
          },
          { new: true }
        ).populate("product")

        //increase count and total
        cart = await Cart.findByIdAndUpdate(
          cartId,
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
          cart: cartId,
        })
        // push item to cart and increment total
        cart = await Cart.findByIdAndUpdate(
          cartId,

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

    res.cookie("cartId", cart._id, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
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
  const { cartId } = req.cookies

  try {
    let cart = await Cart.findById(cartId)
    if (!cart) return next(new ErrorResponse("Cart not found for user", 404))
    let product = await Product.findById(productId)
    if (!product) return next(new ErrorResponse("Product not found", 404))

    //
    let cartProduct = await CartProduct.findOne({
      product: productId,
      cart: cartId,
    }).populate("product")

    const total = cart.total - product.price * count

    if (!cartProduct)
      return next(new ErrorResponse("Cart not found for user", 404))
    cartProduct = await CartProduct.findOneAndUpdate(
      { product: productId, cart: cartId },
      {
        $set: { count, price: product.price * count },
      },
      { new: true }
    ).populate("product")

    //

    cart = await Cart.findByIdAndUpdate(
      cartId,

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
  const { cartId } = req.cookies
  try {
    let cart = await Cart.findById(cartId)
    if (!cart) return next(new ErrorResponse("Cart not found for user", 404))
    let product = await Product.findById(productId)
    if (!product) return next(new ErrorResponse("Product not found", 404))

    //

    let cartProduct = await CartProduct.findOne({
      product: productId,
      cart: cartId,
    }).populate("product")
    if (!cartProduct)
      return next(new ErrorResponse("Product does not exist in cart", 404))

    const total = cart.total - cartProduct.price

    await cartProduct.deleteOne()
    // await CartProduct.findByIdAndDelete(cartProduct.id)

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
//@route - DELETE api/v1/cart/
// @access - Private
exports.clearCart = async function (req, res, next) {
  const { cartId } = req.cookies
  try {
    let cart = await Cart.findById(cartId)
    if (!cart) return next(new ErrorResponse("No cart found", 404))
    // delete cart products associated with cart
    await CartProduct.deleteMany({ cart: cartId })
    // delete cart
    await Cart.findByIdAndDelete(cartId)

    // clear cart from cookie
    res.clearCookie("cartId")
    res
      .status(200)
      .json({ success: true, message: "Cart deleted successfully", data: {} })
  } catch (error) {
    next(error)
  }
}
