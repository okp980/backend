const { Schema, model } = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const ErrorResponse = require("../util/ErrorResponse")

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Minimum password length must be at least 6 characters"],
      select: false,
    },

    phone: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
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

UserSchema.methods.generateToken = function () {
  return jwt.sign({ id: this.id }, process.env.SECRET_JWT, {
    expiresIn: process.env.JWT_EXPIRATION,
  })
}

UserSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex")
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000
  return resetToken
}

UserSchema.statics.findCredentials = async function (email, password) {
  const user = await this.model("User").findOne({ email }).select("+password")
  if (!user) throw new ErrorResponse("Invalid credentials", 401)
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new ErrorResponse("Invalid credentials", 401)
  return user
}

UserSchema.statics.findAdminCredentials = async function (email, password) {
  const user = await this.model("User").findOne({ email }).select("+password")
  if (!user) throw new ErrorResponse("Invalid credentials", 401)
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new ErrorResponse("Invalid credentials", 401)
  if (user.role !== "admin") throw new ErrorResponse("Not Authorised", 401)
  return user
}

// hash password before save to db
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next()
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(this.password, salt)
  this.password = hashedPassword
  next()
})

const User = model("User", UserSchema)

module.exports = User
