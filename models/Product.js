const mongoose = require("mongoose")
const slugify = require("slugify")
const { Schema } = mongoose

const productSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Name of product is required"],
      maxLength: [50, "Maximum length is 50 characters"],
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
      maxLength: [800, "Maximum length is 800 characters"],
    },
    price: {
      type: Number,
      // required: [true, "Price of product is required"],
    },
    oldPrice: {
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
  this.category = subCat.category
  this.slug = slugify(this.name, { lower: true })
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

module.exports = mongoose.model("Product", productSchema)
