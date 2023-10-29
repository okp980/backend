const mongoose = require("mongoose")

const { Schema, model } = mongoose

const shipppingAdressSchema = Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone Number is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    lga: {
      type: String,
      required: [true, "LGA is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    default: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

shipppingAdressSchema.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName
})

shipppingAdressSchema.virtual("full_address").get(function () {
  return `${this.address}, ${this.lga}, ${this.state}.`
})

module.exports = model("ShippingAddress", shipppingAdressSchema)
