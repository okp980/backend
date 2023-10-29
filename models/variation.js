const mongoose = require("mongoose")

const { Schema, model } = mongoose

const variationSchema = Schema(
  {
    attributeValue: [
      { type: Schema.Types.ObjectId, ref: "AttributeValue", required: true },
    ],
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    price: { type: Number },
    price_in_naira: { type: Number },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true },
    image: { type: String },
    inStock: {
      type: Boolean,
      default: true,
      enum: [true, false],
    },
    sold: {
      type: Number,
      default: 0,
      select: false,
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

variationSchema.pre("save", async function (next) {
  const price_CNY = await this.model("ExchangeRate").findOne({
    currency: "CNY",
  })
  // Price in naira
  this.price_in_naira = this.price * price_CNY.rate
  next()
})

module.exports = model("Variation", variationSchema)
