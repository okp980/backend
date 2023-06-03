const mongoose = require("mongoose")

const { Schema, model } = mongoose

const subCategorySchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Name of product is required"],
      maxLength: [30, "Maximum length is 30 characters"],
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    image: String,
  },
  {
    timestamps: true,
  }
)

module.exports = model("SubCategory", subCategorySchema)
