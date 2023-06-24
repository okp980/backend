const mongoose = require("mongoose")

const { Schema, model } = mongoose

const statusStages = [
  "pending",
  "processing",
  "shipment sent to china frieghtya",
  "arrived china sorting center",
  "shipment left china to nigeria",
  "customs clearing at lagos nigeria",
  "arrived lagos sorting center",
  "shipment ready for collection",
  "signed and delivered",
]

const orderSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "CartProduct",
        required: true,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    shippingAddress: [
      {
        type: Schema.Types.ObjectId,
        ref: "ShippingAddress",
        required: true,
      },
    ],
    shippingMethod: {
      type: Schema.Types.ObjectId,
      ref: "ShippingMethod",
      required: true,
    },

    status: {
      type: String,
      enum: statusStages,
      default: "pending",
    },
    shippingDate: {
      type: Date,
    },
    deliveryDate: {
      type: Date,
    },
    TrackingNumber: {
      type: Number,
    },
    refund: {
      type: Boolean,
      default: false,
      enum: [true, false],
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

module.exports = model("Order", orderSchema)
