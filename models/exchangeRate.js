const mongoose = require("mongoose")
const Product = require("./Product")
const Variation = require("./variation")

const { Schema, model } = mongoose

const exchangeRateSchema = Schema(
  {
    rate: {
      type: Number,
      required: [true, "Exchange rate is required"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      enum: ["USD", "EUR", "CNY", "NGN"],
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

exchangeRateSchema.post("findOneAndUpdate", async function () {
  const update = this.getUpdate()

  await Product.updateMany({}, [
    {
      $set: {
        price_in_naira: {
          $cond: [
            {
              $eq: ["$product_type", "simple"],
            },
            { $multiply: ["$price", update["$set"].rate] },

            null,
          ],
        },
      },
    },
  ])
  await Variation.updateMany({}, [
    {
      $set: {
        price_in_naira: {
          $multiply: ["$price", update["$set"].rate],
        },
      },
    },
  ])
  // next()
})

module.exports = model("ExchangeRate", exchangeRateSchema)
