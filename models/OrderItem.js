const mongoose = require("mongoose")

const { Schema, model, Types } = mongoose

const orderItemSchema = Schema(
  {
    product: {
      type: Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    price: {
      type: Number,
      required: [true, "Total is required"],
    },
    order: {
      type: Types.ObjectId,
      ref: "Order",
      required: [true, "order is required"],
    },
    variant: {
      type: Types.ObjectId,
      ref: "Variant",
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

module.exports = model("OrderItem", orderItemSchema)
