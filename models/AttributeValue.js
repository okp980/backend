const mongoose = require("mongoose")

const { Schema, model } = mongoose

const attributeValueSchema = Schema(
  {
    attribute: {
      type: Schema.Types.ObjectId,
      ref: "Attribute",
      required: true,
    },
    value: {
      type: String,
      required: [true, "Attribute Value is required"],
      maxLength: [20, "Maximum length is 20 characters"],
    },
    meta: {
      type: String,
      required: [true, "Attribute Meta is required"],
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

module.exports = model("AttributeValue", attributeValueSchema)
