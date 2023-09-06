const mongoose = require("mongoose")

const { Schema, model } = mongoose

const paymentSchema = Schema(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    paymentMethod: {
      type: Schema.Types.ObjectId,
      ref: "PaymentMethod",
      required: true,
    },
    reference: {
      type: String,
      // required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "success",
        "failed",
        "reversal",
        "cash-on-delivery",
      ],
      default: "pending",
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

module.exports = model("Payment", paymentSchema)
