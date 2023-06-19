const mongoose = require("mongoose")

const { Schema, model } = mongoose

const cartSchema = Schema(
  {
    products: [
      { type: Schema.Types.ObjectId, ref: "CartProduct", required: true },
    ],
    total: {
      type: Number,
      default: 0,
      required: true,
    },
    totalAfterDiscount: Number,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

module.exports = model("Cart", cartSchema)
