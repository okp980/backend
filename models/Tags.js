const mongoose = require("mongoose")

const { Schema, model } = mongoose

const tagsSchema = Schema(
  {
    name: String,
  },
  {
    timestamps: true,
  }
)

module.exports = model("Category", tagsSchema)
