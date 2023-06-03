const mongoose = require("mongoose")

const { Schema, model } = mongoose

const categorySchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Name of product is required"],
      maxLength: [30, "Maximum length is 30 characters"],
    },
    //   type: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "SubCategory",
    //   },
    image: String,
  },
  {
    timestamps: true,
  }
)

module.exports = model("Category", categorySchema)
