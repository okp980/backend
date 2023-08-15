const mongoose = require("mongoose")

const { Schema, model } = mongoose

const variationSchema = Schema(
  {
    attributeValue: [
      { type: Schema.Types.ObjectId, ref: "AttributeValue", required: true },
    ],
    price: { type: Number, required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true },
    image: { type: String },
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

module.exports = model("Variation", variationSchema)
