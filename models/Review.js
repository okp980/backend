const mongoose = require("mongoose")

const { Schema, model } = mongoose

const reviewSchema = Schema(
  {
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
      required: true,
    },
    comment: {
      type: String,
      required: true,
      maxLength: [100, "Comment must be at least 50 characters"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
)

module.exports = model("Review", reviewSchema)
