const mongoose = require("mongoose")

const { Schema, model } = mongoose

const paymentMethodSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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

module.exports = model("PaymentMethod", paymentMethodSchema)
