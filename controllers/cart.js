const mongoose = require("mongoose")
const Cart = require("../models/Cart")
const Product = require("../models/Product")
const ErrorResponse = require("../util/ErrorResponse")
const CartProduct = require("../models/CartProduct")
const Variation = require("../models/variation")

//@desc - Get Single Cart
//@route - GET api/v1/cart
// @access - Private
exports.getCart = async function (req, res, next) {
  const { cartId } = req.cookies
  try {
    const cart = await Cart.findById(cartId).populate({
      path: "products",
      populate: {
        path: "product",
        select: "name image sub_category",
        populate: { path: "sub_category", select: "name" },
      },
    })
    if (!cart) return res.status(200).json({ success: true, data: null })

    res.status(200).json({ success: true, data: cart })
  } catch (error) {
    next(error)
  }
}

//@desc - add to Cart
//@route - POST api/v1/cart/
// @access - Private
exports.AddToCart = async function (req, res, next) {
  const { productId, variant } = req.body
  const { cartId } = req.cookies

  console.log("product id", productId)
  console.log("varaint id", variant)

  try {
    let cart = null
    let variationProduct = null
    let product = await Product.findById(productId)
    if (!product) return next(new ErrorResponse("Product not found", 404))
    if (cartId) {
      cart = await Cart.findById(cartId).populate("products")
    }

    if (variant) {
      variationProduct = await Variation.findById(variant)
    }

    if (!cart) {
      const cartProduct = await new CartProduct({
        product: productId,
        price: variationProduct ? variationProduct.price : product.price,
        variant,
      })

      cart = await Cart.create({
        products: [cartProduct._id],
        total: variationProduct ? variationProduct.price : product.price,
      })
      cartProduct.cart = cart._id
      await cartProduct.save()
    } else {
      let cartProduct = await CartProduct.findOne({
        product: productId,
        cart: cartId,
        variant,
      }).populate("product")

      if (cartProduct) {
        cartProduct = await CartProduct.findOneAndUpdate(
          { product: productId, variant, cart: cartId },
          {
            $inc: {
              count: 1,
              price: variationProduct ? variationProduct.price : product.price,
            },
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
          price: variationProduct ? variationProduct.price : product.price,
          cart: cartId,
          variant,
        })
        // push item to cart and increment total
        cart = await Cart.findByIdAndUpdate(
          cartId,

          {
            $push: {
              products: newCartProduct,
            },
            $inc: {
              total: variationProduct ? variationProduct.price : product.price,
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

//@desc - Update Cart Item Count
//@route - PUT api/v1/cart/:cartId/cartProducts/:cartProductId
// @access - Private
exports.updateCartCount = async function (req, res, next) {
  const { count } = req.body
  const cartProductId = req.params.cartProductId
  const cartId = req.params.cartId

  try {
    let cartProduct = await CartProduct.findById(cartProductId).populate(
      "product"
    )
    if (!cartProduct)
      return next(new ErrorResponse("Product does not exist in Cart", 404))
    const newPrice = cartProduct.product.price * Number(count)
    if (count === 0) {
      await cartProduct.deleteOne()
      cartProduct = null
    } else {
      await cartProduct.updateOne({ count, price: newPrice })
      await cartProduct.save()
    }

    let cart = await Cart.findById(cartId).populate("products")
    if (!cart) return next(new ErrorResponse("No Cart Found", 404))
    if (cart.products.length === 0) {
      await Cart.findByIdAndDelete(cartId, { new: true })
      cart = null // come back to this, find more appropriate way
    } else {
      const newTotal = cart.products.reduce(
        (prev, curr) => prev + curr.price,
        0
      )
      cart = await Cart.findByIdAndUpdate(
        cartId,
        { total: newTotal },
        { new: true }
      ).populate("products")
    }

    if (!cart) {
      // clear cart from cookie
      res.clearCookie("cartId")
    }
    res.status(200).json({
      success: true,
      message: !cartProduct
        ? "Product deleted from Cart"
        : !cart
        ? "Cart is Empty"
        : "Cart updated successfully",
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
