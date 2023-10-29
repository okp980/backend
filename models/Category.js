const mongoose = require("mongoose")
const { default: slugify } = require("slugify")

const { Schema, model } = mongoose

const categorySchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Name of category is required"],
      maxLength: [30, "Maximum length is 30 characters"],
      unique: true,
    },
    slug: {
      type: String,
      required: true,
    },
    //   type: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "SubCategory",
    //   },
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

categorySchema.statics.getSlug = function (name) {
  return slugify(name, { lower: true })
}

module.exports = model("Category", categorySchema)
