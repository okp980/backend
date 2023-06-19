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
    duration: {
      type: Number,
      required: [true, "Duration is required"],
    },

    charge: {
      type: Number,
      required: [true, "Charge is required"],
      default: 0,
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

module.exports = model("ShippingMethod", shippingMethodSchema)
