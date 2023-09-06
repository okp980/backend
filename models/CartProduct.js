const mongoose = require("mongoose")

const { Schema, model } = mongoose

const cartProductSchema = Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    count: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    variant: {
      type: Schema.Types.ObjectId,
      ref: "Variation",
    },
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
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

module.exports = model("CartProduct", cartProductSchema)
