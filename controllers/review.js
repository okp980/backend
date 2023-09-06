const { default: mongoose } = require("mongoose")
const Order = require("../models/Order")
const Product = require("../models/Product")
const Review = require("../models/Review")
const ErrorResponse = require("../util/ErrorResponse")

//@desc - Get all Reviews
//@route - GET api/v1/reviews
//@route - GET api/v1/products/:productId/reviews
// @access - Public
exports.getReviews = async function (req, res, next) {
  let reviews = []
  let agg = []
  try {
    if (req.params.productId) {
      const product = await Product.findById(req.params.productId)
      if (!product) return next(new ErrorResponse("Product not found", 404))
      reviews = await Review.find({ product: req.params.productId })
        .populate("user")
        .populate("product")

      agg = await Review.aggregate([
        {
          $match: {
            product: new mongoose.Types.ObjectId(req.params.productId),
          },
        },
        {
          $group: {
            _id: "$product",
            averageRating: { $avg: "$rating" },
            sum: { $sum: 1 },
          },
        },
      ])
    } else {
      reviews = await Review.find({ user: req.user.id })
    }
    res.status(200).json({
      success: true,
      totalReviews: agg[0]?.sum ? agg[0]?.sum : undefined,
      averageRating: agg[0]?.averageRating ? agg[0]?.averageRating : undefined,
      count: reviews.length,
      data: reviews,
    })
  } catch (error) {
    next(error)
  }
}

//@desc - Get Single Review
//@route - GET api/v1/reviews/:reviewId
// @access - Private
exports.getReview = async function (req, res, next) {
  try {
    const review = await Review.findById(req.params.reviewId)
    if (!review) return next(new ErrorResponse("Review not found", 404))

    res.status(200).json({ success: true, data: review })
  } catch (error) {
    next(error)
  }
}

//@desc - Create Review
//@route - POST api/v1/reviews
// @access - Private
exports.createReview = async function (req, res, next) {
  const { product, rating, comment } = req.body
  try {
    let foundProduct = await Product.findById(product)
    if (!foundProduct) return next(new ErrorResponse("Product not found", 404))
    // let foundOrder = await Order.findById(order)
    // if (!foundOrder) return next(new ErrorResponse("Order not found", 404))
    // const orderStatus = foundOrder.status
    // if (orderStatus !== "signed and delivered")
    //   return next(
    //     new ErrorResponse("Cannot create review for an uncompleted order", 403)    //TODO: return to this
    //   )

    // review this, should product to search parameters
    const hasReviewed = await Review.findOne({
      user: req.user.id,
      product: foundProduct,
    })

    if (hasReviewed)
      return next(
        new ErrorResponse("Cannot create multiple review for this product", 403)
      )
    const review = await Review.create({
      product,
      rating,
      comment,
      user: req.user.id,
    })
    res.status(201).json({ success: true, data: review })
  } catch (error) {
    next(error)
  }
}

//@desc - Update Review
//@route - PUT api/v1/reviews/:reviewId
// @access - Private
exports.updateReview = async function (req, res, next) {
  try {
    let review = await Review.findById(req.params.reviewId)
    if (!review) return next(new ErrorResponse("Review not found", 404))
    review = await Review.findByIdAndUpdate(req.params.reviewId, req.body, {
      new: true,
      runValidators: true,
    })
    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    })
  } catch (error) {
    next(error)
  }
}

//@desc - Delete Review
//@route - DELETE api/v1/reviews/:reviewId
// @access - Private
exports.deleteReview = async function (req, res, next) {
  try {
    let review = await Review.findById(req.params.reviewId)
    if (!review) return next(new ErrorResponse("Review not found", 404))
    review = await Review.findByIdAndDelete(req.params.reviewId)
    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully", data: {} })
  } catch (error) {
    next(error)
  }
}
