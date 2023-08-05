const mongoose = require("mongoose")

const { Schema, model } = mongoose

const attributeSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Attribute is required"],
      maxLength: [20, "Maximum length is 20 characters"],
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

attributeSchema.virtual("values", {
  ref: "AttributeValue",
  localField: "_id",
  foreignField: "attribute",
  justOne: false,
})

module.exports = model("Attribute", attributeSchema)
