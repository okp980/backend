const mongoose = require("mongoose")

const { Schema, model } = mongoose

const tagSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Tag name is required"],
      maxLength: 15,
    },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
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

module.exports = model("Tag", tagSchema)
