const mongoose = require("mongoose")

const { Schema, model } = mongoose

const paymentMethodSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = model("PaymentMethod", paymentMethodSchema)
