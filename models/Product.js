const mongoose = require("mongoose")
const slugify = require("slugify")
const Variation = require("./variation")
const { Schema } = mongoose

const productSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Name of product is required"],
      maxLength: [80, "Maximum length is 80 characters"],
    },
    slug: {
      type: String,
      // required: [true, "Slug of product is required"],
      // unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Description of product is required"],
      maxLength: [400, "Maximum length is 400 characters"],
    },

    price: {
      type: Number,
      // required: [true, "Price of product is required"],
    },
    // TODO: remove this
    oldPrice: {
      type: Number,
    },

    price_in_naira: {
      type: Number,
    },
    image: {
      type: String,
      required: [true, "Image of product is required"],
    },
    gallery: {
      type: [String],
      required: [true, "Gallery is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    sub_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: [true, "Sub Category of product is required"],
    },
    quantity: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
      select: false,
    },
    average_rating: {
      type: Number,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    product_type: {
      type: String,
      enum: ["simple", "variable"],
      required: true,
    },
    variants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Variation" }],
    brand: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },

    isFeatured: Boolean,
    inStock: {
      type: Boolean,
      default: true,
      enum: [true, false],
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

productSchema.pre("save", async function (next) {
  const subCat = await this.model("SubCategory").findById(this.sub_category)
  // Category
  this.category = subCat.category
  // Slug
  this.slug = slugify(this.name, { lower: true })
  const price_CNY = await this.model("ExchangeRate").findOne({
    currency: "CNY",
  })
  this.price_in_naira = this.price * price_CNY.rate

  next()
})

productSchema.virtual("max_price").get(function () {
  if (this.product_type === "variable") {
    return 200
  }
  return this.price
})
productSchema.virtual("min_price").get(function () {
  if (this.product_type === "variable") {
    return 50
  }
  return this.price
})
productSchema.virtual("total_quantity").get(function () {
  if (this.product_type === "variable") {
    return 20
  }
  return this.quantity
})

productSchema.virtual("grouped_attributes").get(function () {
  if (this.product_type === "simple") {
    return {}
  }
  return { colors: [{ value: "red", variation_id: 1 }] }
})

module.exports = mongoose.model("Product", productSchema)
