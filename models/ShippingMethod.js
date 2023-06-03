const mongoose = require("mongoose")

const { Schema, model } = mongoose

const shippingMethodSchema = Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxLength: [50, "Maximum length is 50 characters"],
    },

    charge: {
      type: Number,
      required: [true, "Charge is required"],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = model("ShippingMethod", shippingMethodSchema)
