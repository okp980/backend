const mongoose = require("mongoose")
const slugify = require("slugify")
const { Schema } = mongoose

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name of product is required"],
      maxLength: [50, "Maximum length is 50 characters"],
    },
    slug: {
      type: String,
      // required: [true, "Slug of product is required"],
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Description of product is required"],
      maxLength: [800, "Maximum length is 800 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price of product is required"],
    },
    oldPrice: {
      type: Number,
    },
    image: {
      type: String,
      required: [true, "Image of product is required"],
    },
    gallery: {
      type: Array,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      select: false,
    },
    sub_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: [true, "Category of product is required"],
      select: false,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity of product is required"],
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
        ref: "Tags",
      },
    ],
    brand: {
      type: String,
      enum: ["aplle", "samsung"],
    },
    colors: {
      type: String,
      enum: ["red", "orange", "green"],
    },
    meta: {
      sizes: [String],
      weight: {
        value: Number,
        unit: {
          type: String,
          default: "kg",
          enum: ["kg"],
        },
      },
      dimension: {
        height: Number,
        width: Number,
      },
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

productSchema.pre("save", function (next) {
  const subCat = this.model("SubCategory").findById(this.sub_category)
  this.category = subCat.category
  this.slug = slugify(this.name, { lower: true })
  next()
})

module.exports = mongoose.model("Product", productSchema)
