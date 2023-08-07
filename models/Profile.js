const mongoose = require("mongoose")

const { Schema, model } = mongoose

const profileSchema = Schema(
  {
    name: {
      type: String,
    },
    phone: String,
    user: { type: Schema.Types.ObjectId, ref: "User" },
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

module.exports = model("Profile", profileSchema)
