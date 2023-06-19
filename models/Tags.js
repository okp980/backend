const mongoose = require("mongoose")

const { Schema, model } = mongoose

const tagsSchema = Schema(
  {
    name: String,
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

module.exports = model("Category", tagsSchema)
