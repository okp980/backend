const mongoose = require("mongoose")
const { default: slugify } = require("slugify")

const { Schema, model } = mongoose

const subCategorySchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Name of product is required"],
      maxLength: [30, "Maximum length is 30 characters"],
      unique: true,
    },
    slug: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    image: String,
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

subCategorySchema.statics.getSlug = function (name) {
  return slugify(name, { lower: true })
}

module.exports = model("SubCategory", subCategorySchema)
